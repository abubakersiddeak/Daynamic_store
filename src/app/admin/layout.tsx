import AdminSidebar from "./component/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="md:ml-64">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
