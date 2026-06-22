import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBoardForAdmin, getBoardForResult } from "@/lib/repository";
import { ResultPageClient } from "./_components/ResultPageClient";

type PageProps = {
  params: Promise<{ shortCode: string }>;
  searchParams: Promise<{ token?: string }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const ResultPage = async ({ params, searchParams }: PageProps) => {
  const { shortCode } = await params;
  const { token } = await searchParams;

  if (token) {
    const adminBoard = await getBoardForAdmin(shortCode, token);
    if (adminBoard?.revealed) {
      return <ResultPageClient board={adminBoard} />;
    }
  }

  const board = await getBoardForResult(shortCode);

  if (!board) {
    notFound();
  }

  return <ResultPageClient board={board} />;
};

export default ResultPage;
