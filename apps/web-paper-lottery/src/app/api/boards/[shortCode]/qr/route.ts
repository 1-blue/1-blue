import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { getBoardForAdmin, getParticipantPlayUrl } from "@/lib/repository";

type RouteContext = {
  params: Promise<{ shortCode: string }>;
};

export const GET = async (request: Request, context: RouteContext) => {
  const { shortCode } = await context.params;
  const adminToken = new URL(request.url).searchParams.get("adminToken");
  const participantToken = new URL(request.url).searchParams.get("token");

  if (!adminToken || !participantToken) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  const board = await getBoardForAdmin(shortCode, adminToken);

  if (!board) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const participant = board.participants.find((p) => p.token === participantToken);

  if (!participant) {
    return NextResponse.json({ error: "participant_not_found" }, { status: 404 });
  }

  const playUrl = getParticipantPlayUrl(shortCode, participantToken);
  const png = await QRCode.toBuffer(playUrl, { type: "png", margin: 2, width: 280 });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
};
