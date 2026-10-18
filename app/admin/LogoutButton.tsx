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
      className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 border border-gray-200 hover:border-gray-400 rounded-md"
    >
      Sign out
    </button>
  );
}
