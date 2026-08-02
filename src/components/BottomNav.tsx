'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: '首頁', icon: '⌂' },
  { href: '/itinerary', label: '行程', icon: '≡' },
  { href: '/map', label: '地圖', icon: '◎' },
  { href: '/bookings', label: '訂位', icon: '▤' },
  { href: '/tasks', label: '待辦', icon: '✓' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone2-100 bg-white/95 backdrop-blur">
      <ul
        className="mx-auto flex max-w-lg"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV.map((n) => {
          const active =
            n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
          return (
            <li key={n.href} className="flex-1">
              <Link
                href={n.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                  active ? 'text-faroe-700' : 'text-ink-faint'
                }`}
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  {n.icon}
                </span>
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
