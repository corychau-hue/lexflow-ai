import { Sidebar, TopBar, DashboardLayout } from "@/components/layout/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <DashboardLayout>
        <TopBar />
        <main className="p-4 lg:p-8">{children}</main>
      </DashboardLayout>
    </>
  );
}
