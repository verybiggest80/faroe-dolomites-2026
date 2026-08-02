'use client';

import { useLocalToggle } from '@/lib/useLocalToggle';

/** 可勾選的一行（狀態存本機） */
export function CheckItem({
  storageKey,
  label,
  emphasis = false,
}: {
  storageKey: string;
  label: string;
  emphasis?: boolean;
}) {
  const { value, toggle } = useLocalToggle(storageKey);

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-full items-start gap-2.5 py-1.5 text-left"
    >
      <span
        aria-hidden="true"
        className={`mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border text-[11px] leading-none ${
          value
            ? 'border-good-border bg-good-bg text-good-text'
            : emphasis
              ? 'border-alert-border bg-white text-transparent'
              : 'border-stone2-300 bg-white text-transparent'
        }`}
      >
        ✓
      </span>
      <span
        className={`text-sm leading-relaxed ${
          value ? 'text-ink-faint line-through' : 'text-ink-soft'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
