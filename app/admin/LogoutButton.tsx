'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <button
      onClick={logout}
      className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1 border border-[#2a2a2a] hover:border-[#dc2626] rounded-sm"
    >
      Sign out
    </button>
  );
}
