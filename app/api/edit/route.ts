import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 256 * 1024;
const RATE_LIMIT_WINDOW = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const featureKeys = ["pose", "background", "lighting", "outfit"] as const;
type FeatureKey = (typeof featureKeys)[number];
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const current = requestCounts.get(clientKey);
  if (!current || current.resetAt <= now) {
    requestCounts.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") || 0) > MAX_REQUEST_SIZE)
      return NextResponse.json(
        { error: "The uploaded request is too large." },
        { status: 413 },
      );
    if (isRateLimited(getClientKey(request)))
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } },
      );

    const form = await request.formData();
    const reference = form.get("reference");
    const preserve = form.get("preserve");
    if (!(reference instanceof File) || typeof preserve !== "string")
      return NextResponse.json(
        { error: "Reference image and choices are required." },
        { status: 400 },
      );
    if (
      !allowedTypes.has(reference.type) ||
      reference.size === 0 ||
      reference.size > MAX_FILE_SIZE
    )
      return NextResponse.json(
        { error: "Use a JPG, PNG, or WEBP image up to 10 MB." },
        { status: 400 },
      );
    let selections: Partial<Record<FeatureKey, boolean>>;
    try {
      const parsed = JSON.parse(preserve);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
        throw new Error("Invalid choices");
      selections = parsed as Partial<Record<FeatureKey, boolean>>;
    } catch {
      return NextResponse.json(
        { error: "Invalid feature choices." },
        { status: 400 },
      );
    }
    const included = featureKeys.filter((key) => selections[key] === true);
    if (!included.length)
      return NextResponse.json(
        { error: "Choose at least one detail." },
        { status: 400 },
      );
    const key = process.env.FAL_KEY;
    if (!key)
      return NextResponse.json(
        {
          error:
            "Image generation is not configured. Add FAL_KEY to the server environment.",
        },
        { status: 503 },
      );
    const ignored = featureKeys
      .filter((key) => !selections[key])
      .map((key) => {
        if (key === "pose")
          return "DO NOT describe the subject pose, position, or camera angle.";
        if (key === "background")
          return "DO NOT describe the background, environment.";
        if (key === "lighting")
          return "DO NOT describe lighting, color atmosphere, effects, or glow.";
        if (key === "outfit")
        return "DO NOT describe clothing, accessories, jewelry, or styling.";
      })
      .join("\n");
    const dataUrl = `data:${reference.type};base64,${Buffer.from(await reference.arrayBuffer()).toString("base64")}`;
    const response = await fetch("https://fal.run/openrouter/router/vision", {
      method: "POST",
      headers: {
        Authorization: `Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_urls: [dataUrl],
        model: "google/gemini-2.5-flash",
        temperature: 0.3,
        max_tokens: 400, // Increased buffer to prevent truncated prompts
        system_prompt:
          "You are an expert AI prompt engineer and visual style analyst. Output strictly a single detailed image generation prompt or CONTENT_POLICY_VIOLATION. No introduction, conversational text, or markdown formatting.",
        prompt: `CONTENT ASSESSMENT & STYLE-ADAPTIVE PROMPT GENERATION:

      1. SAFETY CHECK:
      Output "CONTENT_POLICY_VIOLATION" ONLY if the image contains explicit pornography, sexually explicit content, or undergarments/swimwear.
      Note: Standard portraiture, exposed arms/shoulders, traditional garments (e.g., kurtas, sarees), art styles, and skin-tone clothing are FULLY SAFE and MUST NOT trigger a policy violation.

      2. INTERNAL VISUAL & LAYOUT ANALYSIS (Perform internally first):
      - Layout Classification: Determine if it is a standard grid, irregular collage, Polaroid stack, vertical slatted/strip mask overlay, or white-outline sticker cutout.
      - Color Mode Separation: Identify if specific panels or background elements are black-and-white while others are full color.
      - Non-photographic Elements: Identify paper textures, tape, stickers, UI graphics, script text, or floral doodles.
      - Frame Count: If there are >5 crowded/scattered frames, classify as a "dense multi-frame photo collage".

      3. PROMPT STRUCTURE TO GENERATE:
      Build a concise prompt under 150 words using this structure:
      - Core Medium & Layout: State the exact medium (e.g., photograph, anime illustration, digital painting) and layout structure (e.g., vertical slatted overlay, layered Polaroid aesthetic, sticker cutout). Specify frame count, shapes, and color modes per section (e.g., monochrome background with full-color subject).
      - Overlays & Graphics: Specify non-photo details like torn paper edges, masking tape, music UI, or handwritten script quotes.
      - Subject & Pose: Describe the subject, shot angles across panels, poses (with accurate side descriptions: right/left), expressions, and traditional accessories (e.g., jhumka earrings, bangles, nose rings).
      - Lighting, Atmosphere & Fine Details: Detail light sources (e.g., golden hour glow, red laser light, window blind shadows), color grading, fabric textures, and mood.
      - Typography & Text: If text is present, describe its style (e.g., cursive, serif, sans-serif) and placement (e.g., top-left corner, bottom-center).

      4. USER SELECTIONS & CONSTRAINTS:
      - SELECTED FEATURES TO COPY: ${included.join(", ")}.  
      - EXCLUSION RULES: ${ignored || "Extract all key visual details freely."}

      STRICT CONSTRAINTS:
      - Always refer to the target subject strictly as "the subject" (e.g., "cinematic portrait of the subject").
      - Never use terms like "sensual", "intimate", "erotic", or "bare skin". Use neutral terms like "warm aesthetic" or "cultural attire".
      - Do not use real brand or trademark names; describe visual elements generically.
      - Keep the subject description generic without inferring specific personal identities.
      - Keep the final output strictly under 150 words total.`
      }),
    });

    const body = await response.json();
    if (!response.ok)
      throw new Error(body?.error?.message || "Reference analysis failed.");
    const prompt = body?.output || body?.choices?.[0]?.message?.content;
    if (typeof prompt !== "string" || !prompt.trim())
      throw new Error("The analysis model returned no prompt.");
    const cleanPrompt = prompt.trim();
    if (cleanPrompt.includes("CONTENT_POLICY_VIOLATION"))
      throw new Error(
        "Image contains restricted content (e.g., swimwear or explicit clothing). Please select a different image.",
      );
    return NextResponse.json(
      { prompt: cleanPrompt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (cause) {
    return NextResponse.json(
      {
        error:
          cause instanceof Error ? cause.message : "Unable to generate prompt.",
      },
      { status: 500 },
    );
  }
}


    //   body: JSON.stringify({
    //     image_urls: [dataUrl],
    //     model: "google/gemini-2.5-flash",
    //     temperature: 0.3,
    //     max_tokens: 300,
    //     system_prompt:
    //       "You are an expert AI prompt engineer and visual style analyst. Output strictly a single detailed image generation prompt or CONTENT_POLICY_VIOLATION. No introduction, conversational text, or markdown formatting.",
    //     prompt: `CONTENT ASSESSMENT & STYLE-ADAPTIVE PROMPT GENERATION:

    //     1. SAFETY CHECK:
    //     Output "CONTENT_POLICY_VIOLATION" ONLY if the image contains explicit pornography, sexually explicit content, or undergarments/swimwear.
    //     Note: Standard portraiture, exposed arms/shoulders, traditional garments (e.g., kurtas, sarees), art styles, and skin-tone clothing are FULLY SAFE and MUST NOT trigger a policy violation.

    //     2. STYLE IDENTIFICATION & PROMPT GENERATION (If Safe):
    //     Analyze the visual medium of the input image (e.g., Photographic, Anime/Manga, Oil Painting, 3D Render, Vintage Poster, Comic Book, Graphic Vector, Cyberpunk, Cinematic Still) and build a prompt using this structure:

    //     - Core Medium & Style: Identify the exact style/medium (e.g., "Makoto Shinkai anime illustration", "1970s retro film poster", "Impressionist oil painting with impasto brushstrokes", "Cinematic portrait photograph").
    //     - Layout & Composition: Specify if it is a "Vintage Scrapbook Collage Layout" or "Layered Polaroid Aesthetic." Describe the exact frame count, shape, rotation, and stacked arrangement. Mention the background texture (e.g., aged paper, cardboard, newsprint).
    //     - Subject & Pose: Describe the character/subject, pose, action, and facial expression.
    //     - Lighting & Atmosphere: Detail light sources, color tones, backlighting, shadows, and mood.
    //     - Textures & Overlays: Specify paper textures, film grain, graphic widgets, handwriting script, or digital painterly effects.
    //     - Fine Details: Capture micro-details like apparel textures, accessories, jewelry, background depth, or specialized brushwork.
    //     - Medium, Style & Textures: Identify medium (e.g., high-quality photographic prints, digital interface, vector botanicals). Describe specific textures like aged paper, grainy film, and painterly lilies.

    //     3. MANDATORY GRAPHIC & LAYOUT ANALYSIS (Do this first internally):
    //     - Determine if the layout is a grid, an irregular collage, or a layered scrapbook aesthetic.
    //     - Identify *non-photographic* elements (e.g., textures, tape, stickers, UI graphics, text).
    //     - Precisely analyze the number, shape, and rotation of all image frames.

    //     4. STRICTLY FOLLOW THE USER'S SELECTIONS:
    //     - SELECTED FEATURES TO COPY: ${included.join(", ")}.  
    //     - EXCLUSION RULES: ${ignored || "Extract all key visual details freely."}

    //     STRICT CONSTRAINTS:
    //     - Always refer to the target subject strictly as "the subject", example - "cinematic portrait of the subject in this .." .
    //     - Never use terms like "sensual", "intimate", "erotic", or "bare skin". Use neutral terms like "warm aesthetic" or "cultural attire".
    //     - Do not use real brand or trademark names; describe visual elements generically.
    //     - Keep the subject description generic without inferring specific personal identities.
    //     - Keep the final output under 150 words total.`,
    //   }),
    // });