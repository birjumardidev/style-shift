import { NextResponse } from "next/server";
import { getAuthenticatedUser, getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const featureKeys = ["pose", "background", "lighting", "outfit"] as const;
type FeatureKey = (typeof featureKeys)[number];

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function dataUrl(file: File, bytes: Buffer) {
  return `data:${file.type};base64,${bytes.toString("base64")}`;
}

async function describeReference(
  reference: File,
  selected: Record<FeatureKey, boolean>,
) {
  const key = process.env.FAL_KEY;
  if (!key)
    throw new Error(
      "Image generation is not configured. Add FAL_KEY to the server environment.",
    );
  const featuresToCopy = featureKeys.filter((item) => selected[item]);
  const ignored = featureKeys
    .filter((item) => !selected[item])
    .map((feature) => {
      if (feature === "pose")
        return 'DO NOT describe reference pose. State: "keeping original natural pose of the subject".';
      if (feature === "background")
        return 'DO NOT describe reference background/environment elements. State: "in a clean neutral setting".';
      if (feature === "lighting")
        return 'DO NOT describe reference lighting effects or glow. State: "with balanced natural lighting".';
      return 'DO NOT describe clothing or jewelry. State: "wearing subject\'s original clothing".';
    })
    .join("\n");
  const response = await fetch("https://fal.run/openrouter/router/vision", {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_urls: [
        dataUrl(reference, Buffer.from(await reference.arrayBuffer())),
      ],
      model: "google/gemini-2.5-flash",
      temperature: 0.3,
      max_tokens: 400,
      system_prompt:
        "You are an expert AI prompt engineer and visual style analyst. Output strictly a single detailed image generation prompt or CONTENT_POLICY_VIOLATION. No introduction, conversational text, or markdown formatting.",
      prompt: `Analyze this reference image and write one image-editing prompt under 150 words. Describe its medium, composition, subject styling, lighting, atmosphere, colors, textures, and graphic overlays. The target subject must remain generic. SELECTED FEATURES TO COPY: ${featuresToCopy.join(", ") || "overall aesthetic"}. EXCLUSION RULES: ${ignored || "Extract all key visual details freely."}. Never use real brand names or terms like sensual, intimate, erotic, or bare skin. Output CONTENT_POLICY_VIOLATION only for explicit pornography or undergarments/swimwear.`,
    }),
  });
  const body = await response.json();
  if (!response.ok)
    throw new Error(body?.error?.message || "Reference analysis failed.");
  const prompt = body?.output || body?.choices?.[0]?.message?.content;
  if (typeof prompt !== "string" || !prompt.trim())
    throw new Error("The analysis model returned no instruction.");
  if (prompt.includes("CONTENT_POLICY_VIOLATION"))
    throw new Error(
      "Image contains restricted content. Please select a different image.",
    );
  return prompt.trim();
}

async function createImageEdit(original: File, prompt: string) {
  const key = process.env.FAL_KEY;
  if (!key)
    throw new Error(
      "Image generation is not configured. Add FAL_KEY to the server environment.",
    );
  const response = await fetch("https://fal.run/openai/gpt-image-2/edit", {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `${prompt}\n\nKeep all other unmentioned details and subject facial identity intact.`,
      image_urls: [
        dataUrl(original, Buffer.from(await original.arrayBuffer())),
      ],
      quality: "low",
      input_fidelity: "low",
    }),
  });
  const body = await response.json();
  if (!response.ok)
    throw new Error(body?.error?.message || "Image generation failed.");
  const image = body?.images?.[0]?.url;
  if (typeof image !== "string")
    throw new Error("The image model returned no output URL.");
  return image;
}

export async function POST(request: Request) {
  let reservedUserId: string | null = null;
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return error("Please sign in to use StyleShift.", 401);
    reservedUserId = user.id;
    const admin = getSupabaseAdmin();
    const { error: reserveError } = await admin.rpc(
      "reserve_styleshift_credit",
      { target_user_id: user.id },
    );
    if (reserveError)
      return error(
        reserveError.message.includes("NO_CREDITS")
          ? "You are out of StyleShift credits. Buy more credits to continue."
          : "Unable to reserve a StyleShift credit.",
        reserveError.message.includes("NO_CREDITS") ? 402 : 500,
      );
    const form = await request.formData();
    const original = form.get("original");
    const reference = form.get("reference");
    const selection = form.get("preserve");
    if (
      !(original instanceof File) ||
      !(reference instanceof File) ||
      typeof selection !== "string"
    )
      return error("Both images and your visual choices are required.");
    for (const image of [original, reference])
      if (
        !allowedTypes.has(image.type) ||
        image.size === 0 ||
        image.size > MAX_FILE_SIZE
      )
        return error("Use a JPG, PNG, or WEBP image up to 10 MB.");
    let selected: Record<FeatureKey, boolean>;
    try {
      selected = JSON.parse(selection);
    } catch {
      return error("Invalid visual choices.");
    }
    if (!featureKeys.some((feature) => selected[feature]))
      return error("Choose at least one visual to copy.");
    const prompt = await describeReference(reference, selected);
    const image = await createImageEdit(original, prompt);
    return NextResponse.json(
      { image },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (cause) {
    if (reservedUserId) {
      try {
        await getSupabaseAdmin().rpc("refund_styleshift_credit", {
          target_user_id: reservedUserId,
        });
      } catch {
        /* Keep the original generation error. */
      }
    }
    const message =
      cause instanceof Error ? cause.message : "Unable to create your edit.";
    console.error("StyleShift failure:", message);
    return error(message, 500);
  }
}
