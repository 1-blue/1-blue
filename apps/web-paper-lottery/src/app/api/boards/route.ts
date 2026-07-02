import { NextResponse } from "next/server";
import type { BoardInput } from "@/core";
import { createBoard } from "@/lib/repository";

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as BoardInput;
    const result = await createBoard(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
