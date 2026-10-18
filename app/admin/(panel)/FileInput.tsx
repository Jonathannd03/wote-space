'use client';

import { useRef, useState } from 'react';
import { useAdminLang } from './AdminLangProvider';

interface FileInputProps {
  id: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  onChange?: (files: FileList | null) => void;
}

export default function FileInput({ id, name, accept, multiple, required, onChange }: FileInputProps) {
  const { lang } = useAdminLang();
  const ref = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState<string>('');

  const placeholder = lang === 'fr'
    ? (multiple ? 'Aucun fichier sélectionné' : 'Aucun fichier sélectionné')
    : (multiple ? 'No file selected' : 'No file selected');

  const buttonLabel = lang === 'fr' ? 'Choisir' : 'Choose';

  const handleChange = () => {
    const files = ref.current?.files;
    if (!files || files.length === 0) {
      setLabel('');
      onChange?.(null);
      return;
    }
    if (files.length === 1) {
      setLabel(files[0].name);
    } else {
      setLabel(lang === 'fr' ? `${files.length} fichiers` : `${files.length} files`);
    }
    onChange?.(files);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={ref}
        id={id}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        required={required}
        onChange={handleChange}
        className="sr-only"
        aria-label={lang === 'fr' ? 'Sélectionner un fichier' : 'Select file'}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex-shrink-0 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
      >
        {buttonLabel}
      </button>
      <span className="text-sm text-gray-400 truncate min-w-0">
        {label || placeholder}
      </span>
    </div>
  );
}
