import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden px-4 py-8 md:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-6xl space-y-10 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}