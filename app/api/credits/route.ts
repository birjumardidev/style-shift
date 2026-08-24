import { NextResponse } from "next/server";
import { getAuthenticatedUser, getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const { data, error } = await getSupabaseAdmin().rpc("ensure_user_credits", {
    target_user_id: user.id,
  });
  if (error)
    return NextResponse.json(
      { error: "Unable to load credits." },
      { status: 500 },
    );
  return NextResponse.json({ credits: data });
}
