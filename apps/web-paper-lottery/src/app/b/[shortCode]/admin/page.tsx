import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBoardForAdmin } from "@/lib/repository";
import { AdminPageClient } from "./_components/AdminPageClient";

type PageProps = {
  params: Promise<{ shortCode: string }>;
  searchParams: Promise<{ token?: string }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const AdminPage = async ({ params, searchParams }: PageProps) => {
  const { shortCode } = await params;
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  const board = await getBoardForAdmin(shortCode, token);

  if (!board) {
    notFound();
  }

  return <AdminPageClient shortCode={shortCode} token={token} initialBoard={board} />;
};

export default AdminPage;
