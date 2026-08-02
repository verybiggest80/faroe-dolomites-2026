'use client';

import { getTicket, slotLabel, type StoredTicket } from '@/data/private/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * 票券檢視器 — 從這台裝置的 IndexedDB 讀出 QR code 並全螢幕顯示。
 * 圖檔從未上傳，離線一樣打得開。
 */
export function TicketViewer({
  ticketId,
  onClose,
}: {
  ticketId: string;
  onClose: () => void;
}) {
  const [ticket, setTicket] = useState<StoredTicket | null | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    getTicket(ticketId).then((t) => {
      setTicket(t ?? null);
      if (t?.image) {
        url = URL.createObjectURL(t.image);
        setImageUrl(url);
      }
    });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [ticketId]);

  // Esc 關閉
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="票券"
    >
      <header className="flex items-center gap-3 border-b border-stone2-100 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
            🔒 只存在這台裝置
          </p>
          <h2 className="truncate text-[15px] font-semibold">{slotLabel(ticketId)}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn-quiet shrink-0 text-[13px]"
          aria-label="關閉"
        >
          關閉
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {ticket === undefined && (
          <p className="py-10 text-center text-[13px] text-ink-faint">讀取中…</p>
        )}

        {ticket === null && <EmptyState />}

        {ticket && (
          <>
            {imageUrl ? (
              <div className="rounded-xl2 border border-stone2-100 bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="票券 QR code"
                  className="mx-auto w-full max-w-sm rounded-lg"
                />
              </div>
            ) : (
              <div className="card-alert p-4 text-[13px] leading-relaxed text-alert-text">
                這張票券還沒有加入圖檔。可以到私人票券頁補上 QR code 圖片。
              </div>
            )}

            {(ticket.reference || ticket.note) && (
              <dl className="mt-4 space-y-2 rounded-xl border border-stone2-100 bg-stone2-100/40 p-3.5">
                {ticket.reference && (
                  <div>
                    <dt className="text-[11px] font-semibold text-ink-faint">編號</dt>
                    <dd className="mt-0.5 select-all break-all font-display text-[17px] font-semibold tabular-nums">
                      {ticket.reference}
                    </dd>
                  </div>
                )}
                {ticket.note && (
                  <div>
                    <dt className="text-[11px] font-semibold text-ink-faint">備註</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap text-[14px] leading-relaxed text-ink-soft">
                      {ticket.note}
                    </dd>
                  </div>
                )}
              </dl>
            )}

            <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
              掃描前記得把螢幕亮度調到最高。
              <br />
              原檔請同時留在手機相簿，這裡不是備份。
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-6">
      <div className="card-alert p-4">
        <p className="text-[13px] font-semibold text-alert-text">這台裝置還沒有這張票券</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-alert-text/85">
          票券只存在你自己的裝置，不會跟著網站同步。換手機或換瀏覽器都要重新加入一次。
        </p>
      </div>
      <Link href="/private" className="btn-primary mt-4 w-full text-[13px]">
        去加入票券
      </Link>
    </div>
  );
}

/** 行程卡上的「顯示票券」按鈕 */
export function TicketButton({ ticketId }: { ticketId: string }) {
  const [open, setOpen] = useState(false);
  const [has, setHas] = useState<boolean | null>(null);

  useEffect(() => {
    getTicket(ticketId).then((t) => setHas(Boolean(t)));
  }, [ticketId, open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`btn text-[13px] ${
          has
            ? 'border border-good-border bg-good-bg text-good-text'
            : 'border border-stone2-300 bg-white text-ink-faint'
        }`}
      >
        🎫 {has ? '顯示票券' : '票券未加入'}
      </button>
      {open && <TicketViewer ticketId={ticketId} onClose={() => setOpen(false)} />}
    </>
  );
}
