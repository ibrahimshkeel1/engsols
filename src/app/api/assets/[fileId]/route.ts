import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createPremiumAssetSignedUrl,
  getPremiumAssetById,
  userHasPremiumAssetAccess,
} from "@/lib/premium-assets";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ fileId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { fileId } = await context.params;

  if (!fileId) {
    return NextResponse.json({ error: "Missing asset id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const asset = await getPremiumAssetById(fileId);
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const hasAccess = await userHasPremiumAssetAccess(user.id, asset.exam_id);
  if (!hasAccess) {
    return NextResponse.json(
      { error: "Purchase this exam or hold an active mentorship to access premium materials." },
      { status: 403 },
    );
  }

  const signed = await createPremiumAssetSignedUrl(asset.storage_path, 60);
  if ("error" in signed) {
    return NextResponse.json({ error: signed.error }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl, { status: 302 });
}
