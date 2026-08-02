'use client';

import { PageHeader } from '@/components/PageHeader';
import {
  PRIVATE_TICKET_SLOTS,
  deletePrivateTicket,
  readPrivateTickets,
  writePrivateTicket,
} from '@/data/private/store';
import type { PrivateTicket } from '@/types/trip';
import { useEffect, useState } from 'react';

export default function PrivatePage() {
  const [tickets, setTickets] = useState<Record<string, PrivateTicket>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTickets(readPrivateTickets());
    setReady(true);
  }, []);

  const save = (slotId: string, label: string, reference: string, note: string) => {
    const t: PrivateTicket = {
      id: slotId,
      label,
      reference: reference || undefined,
      fields: note ? [{ label: '備註', value: note }] : undefined,
    };
    writePrivateTicket(t);
    setTickets(readPrivateTickets());
    setOpenId(null);
  };

  const remove = (slotId: string) => {
    deletePrivateTicket(slotId);
    setTickets(readPrivateTickets());
  };

  return (
    <main>
      <PageHeader
        eyebrow="🔒 私人"
        title="票券與訂位編號"
        subtitle="這頁的內容只存在這台裝置的瀏覽器，不會上傳、不會同步、也不會進版本控制。"
      />

      <div className="px-5 pb-10">
        <div className="card-alert mb-5 p-4">
          <p className="text-[13px] font-semibold text-alert-text">重要</p>
          <ul className="mt-1.5 space-y-1 text-[13px] leading-relaxed text-alert-text/85">
            <li>· 這裡不是主要的離線備份。QR code 請另外存到手機相簿或 Wallet。</li>
            <li>· 清除瀏覽器資料會一併清掉這頁的內容。</li>
            <li>· 不要把信用卡號或護照號碼放進來。</li>
          </ul>
        </div>

        {!ready ? (
          <p className="text-[13px] text-ink-faint">載入中…</p>
        ) : (
          <div className="space-y-3">
            {PRIVATE_TICKET_SLOTS.map((slot) => {
              const saved = tickets[slot.id];
              const editing = openId === slot.id;
              return (
                <article key={slot.id} className="card p-4">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[14px] font-semibold leading-snug">{slot.label}</h2>
                      {slot.hint && (
                        <p className="mt-0.5 text-[11px] font-medium text-alert-text">
                          {slot.hint}
                        </p>
                      )}
                    </div>
                    <span
                      className={`chip ${
                        saved
                          ? 'border-good-border bg-good-bg text-good-text'
                          : 'border-stone2-300 bg-white text-ink-faint'
                      }`}
                    >
                      {saved ? '已填' : '空白'}
                    </span>
                  </div>

                  {saved && !editing && (
                    <dl className="mt-3 space-y-1 border-t border-stone2-100 pt-3">
                      {saved.reference && (
                        <div className="flex gap-2 text-[13px]">
                          <dt className="w-16 shrink-0 text-ink-faint">編號</dt>
                          <dd className="break-all text-ink-soft">{saved.reference}</dd>
                        </div>
                      )}
                      {saved.fields?.map((f) => (
                        <div key={f.label} className="flex gap-2 text-[13px]">
                          <dt className="w-16 shrink-0 text-ink-faint">{f.label}</dt>
                          <dd className="break-words text-ink-soft">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {editing ? (
                    <TicketForm
                      initial={saved}
                      onCancel={() => setOpenId(null)}
                      onSave={(ref, note) => save(slot.id, slot.label, ref, note)}
                    />
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenId(slot.id)}
                        className="btn-quiet text-[13px]"
                      >
                        {saved ? '編輯' : '填入'}
                      </button>
                      {saved && (
                        <button
                          type="button"
                          onClick={() => remove(slot.id)}
                          className="btn text-[13px] text-ink-faint"
                        >
                          清除
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function TicketForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: PrivateTicket;
  onSave: (reference: string, note: string) => void;
  onCancel: () => void;
}) {
  const [reference, setReference] = useState(initial?.reference ?? '');
  const [note, setNote] = useState(initial?.fields?.[0]?.value ?? '');

  return (
    <div className="mt-3 space-y-2 border-t border-stone2-100 pt-3">
      <label className="block">
        <span className="text-[11px] font-semibold text-ink-faint">訂位／票券編號</span>
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone2-300 px-3 py-2 text-[14px]"
          placeholder="例如 ABC123"
        />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold text-ink-faint">備註</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-stone2-300 px-3 py-2 text-[14px]"
          placeholder="例如：鑰匙盒密碼、車牌、聯絡電話"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSave(reference.trim(), note.trim())}
          className="btn-primary text-[13px]"
        >
          儲存到這台裝置
        </button>
        <button type="button" onClick={onCancel} className="btn-quiet text-[13px]">
          取消
        </button>
      </div>
    </div>
  );
}
