import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBoardForPlay } from "@/lib/repository";
import { PlayPageClient } from "./_components/PlayPageClient";

type PageProps = {
  params: Promise<{ shortCode: string }>;
  searchParams: Promise<{ token?: string }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const PlayPage = async ({ params, searchParams }: PageProps) => {
  const { shortCode } = await params;
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  const board = await getBoardForPlay(shortCode, token);

  if (!board) {
    notFound();
  }

  return <PlayPageClient shortCode={shortCode} token={token} initialBoard={board} />;
};

export default PlayPage;
