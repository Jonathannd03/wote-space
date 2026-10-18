'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { AdminLang } from '@/lib/admin-i18n';
import translations from '@/lib/admin-i18n';

interface AdminLangCtx {
  lang: AdminLang;
  t: typeof translations.en;
  toggle: () => void;
}

const AdminLangContext = createContext<AdminLangCtx>({
  lang: 'fr',
  t: translations.fr,
  toggle: () => {},
});

export function useAdminLang() {
  return useContext(AdminLangContext);
}

export default function AdminLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<AdminLang>('fr');

  useEffect(() => {
    const saved = document.cookie.match(/admin-lang=([^;]+)/)?.[1] as AdminLang | undefined;
    if (saved === 'en' || saved === 'fr') setLang(saved);
  }, []);

  const toggle = () => {
    const next: AdminLang = lang === 'fr' ? 'en' : 'fr';
    setLang(next);
    document.cookie = `admin-lang=${next};path=/;max-age=31536000`;
  };

  return (
    <AdminLangContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </AdminLangContext.Provider>
  );
}
