import Sidebar from './Sidebar';
import AdminLangProvider from './AdminLangProvider';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLangProvider>
      <div className="flex min-h-screen bg-[#f5f5f5]">
        <Sidebar />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </AdminLangProvider>
  );
}
