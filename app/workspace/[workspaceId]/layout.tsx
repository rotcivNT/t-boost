import Header from "@/components/workspace/header/Header";
import Sidebar from "@/components/workspace/sidebar/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-bg">
      <Header />
      <main className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
