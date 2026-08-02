'use client';

import { PageHeader } from '@/components/PageHeader';
import { TicketViewer } from '@/components/TicketViewer';
import {
  PRIVATE_TICKET_SLOTS,
  deleteTicket,
  formatBytes,
  getTicket,
  listTickets,
  putTicket,
  type StoredTicket,
} from '@/data/private/store';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function PrivatePage() {
  const [tickets, setTickets] = useState<Record<string, StoredTicket>>({});
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const all = await listTickets();
    const map: Record<string, StoredTicket> = {};
    all.forEach((t) => (map[t.id] = t));
    setTickets(map);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const usage = Object.values(tickets).reduce((s, t) => s + (t.image?.size ?? 0), 0);
  const critical = PRIVATE_TICKET_SLOTS.filter((s) => s.critical);
  const others = PRIVATE_TICKET_SLOTS.filter((s) => !s.critical);
  const criticalDone = critical.filter((s) => tickets[s.id]?.image).length;

  return (
    <main>
      <PageHeader
        eyebrow="🔒 私人"
        title="票券"
        subtitle="QR code 只存在這台裝置，不會上傳、不會同步、不在網站裡。就算有人拿到網址，也看不到這一頁的內容。"
      />

      <div className="px-5 pb-10">
        {/* 離線必備進度 */}
        <div
          className={`mb-5 p-4 ${
            criticalDone === critical.length ? 'card border-good-border bg-good-bg' : 'card-alert'
          }`}
        >
          <p
            className={`text-[13px] font-semibold ${
              criticalDone === critical.length ? 'text-good-text' : 'text-alert-text'
            }`}
          >
            {criticalDone === critical.length
              ? '✓ 四張離線必備票券都已加入'
              : `離線必備票券：${criticalDone} / ${critical.length} 已加入`}
          </p>
          <p
            className={`mt-1 text-[13px] leading-relaxed ${
              criticalDone === critical.length ? 'text-good-text/85' : 'text-alert-text/85'
            }`}
          >
            Mykines、Kalsoy、Seceda、Tre Cime 都在沒訊號的地方，票券一定要能離線打開。
          </p>
        </div>

        {/* 警告 */}
        <div className="mb-6 rounded-xl border border-stone2-100 bg-stone2-100/40 p-4">
          <p className="text-[13px] font-semibold">⚠ 這裡不是備份</p>
          <ul className="mt-1.5 space-y-1 text-[13px] leading-relaxed text-ink-soft">
            <li>· 清除瀏覽器資料會一併清掉，請務必把 QR 原檔留在手機相簿。</li>
            <li>· 換手機、換瀏覽器都要重新加入一次。</li>
            <li>· 不要放信用卡號或護照號碼。</li>
          </ul>
          {usage > 0 && (
            <p className="mt-2 text-xs text-ink-faint">
              目前佔用 {formatBytes(usage)}
            </p>
          )}
        </div>

        {!ready ? (
          <p className="text-[13px] text-ink-faint">讀取中…</p>
        ) : (
          <>
            <h2 className="section-title mb-2.5">離線必備</h2>
            <div className="mb-8 space-y-3">
              {critical.map((slot) => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  ticket={tickets[slot.id]}
                  editing={editing === slot.id}
                  onEdit={() => setEditing(slot.id)}
                  onCancel={() => setEditing(null)}
                  onView={() => setViewing(slot.id)}
                  onSaved={async () => {
                    setEditing(null);
                    await refresh();
                  }}
                />
              ))}
            </div>

            <h2 className="section-title mb-2.5">其他</h2>
            <div className="space-y-3">
              {others.map((slot) => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  ticket={tickets[slot.id]}
                  editing={editing === slot.id}
                  onEdit={() => setEditing(slot.id)}
                  onCancel={() => setEditing(null)}
                  onView={() => setViewing(slot.id)}
                  onSaved={async () => {
                    setEditing(null);
                    await refresh();
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {viewing && <TicketViewer ticketId={viewing} onClose={() => setViewing(null)} />}
    </main>
  );
}

/* ------------------------------------------------------------------ */

function SlotCard({
  slot,
  ticket,
  editing,
  onEdit,
  onCancel,
  onView,
  onSaved,
}: {
  slot: {
    id: string;
    label: string;
    hint?: string;
    critical?: boolean;
    bookingId?: string;
    hasGuideDetails?: boolean;
  };
  ticket?: StoredTicket;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onView: () => void;
  onSaved: () => void;
}) {
  const hasImage = Boolean(ticket?.image);

  return (
    <article className="card p-4">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold leading-snug">{slot.label}</h3>
          {slot.hint && (
            <p
              className={`mt-0.5 text-[11px] font-medium ${
                slot.critical ? 'text-alert-text' : 'text-ink-faint'
              }`}
            >
              {slot.hint}
            </p>
          )}
        </div>
        <span
          className={`chip shrink-0 ${
            hasImage
              ? 'border-good-border bg-good-bg text-good-text'
              : ticket
                ? 'border-faroe-200 bg-faroe-50 text-faroe-700'
                : 'border-stone2-300 bg-white text-ink-faint'
          }`}
        >
          {hasImage ? '有 QR' : ticket ? '僅文字' : '空白'}
        </span>
      </div>

      {ticket && !editing && (
        <div className="mt-3 space-y-1 border-t border-stone2-100 pt-3">
          {ticket.reference && (
            <p className="text-[13px]">
              <span className="text-ink-faint">編號　</span>
              <span className="select-all break-all text-ink-soft">{ticket.reference}</span>
            </p>
          )}
          {ticket.note && (
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink-soft">
              {ticket.note}
            </p>
          )}
        </div>
      )}

      {editing ? (
        <TicketForm
          slotId={slot.id}
          initial={ticket}
          hasGuideDetails={slot.hasGuideDetails}
          onCancel={onCancel}
          onSaved={onSaved}
        />
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {hasImage && (
            <button type="button" onClick={onView} className="btn-primary text-[13px]">
              🎫 顯示
            </button>
          )}
          <button type="button" onClick={onEdit} className="btn-quiet text-[13px]">
            {ticket ? '編輯' : '加入票券'}
          </button>
        </div>
      )}
    </article>
  );
}

function TicketForm({
  slotId,
  initial,
  hasGuideDetails,
  onCancel,
  onSaved,
}: {
  slotId: string;
  initial?: StoredTicket;
  hasGuideDetails?: boolean;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [reference, setReference] = useState(initial?.reference ?? '');
  const [note, setNote] = useState(initial?.note ?? '');
  const [guidePhone, setGuidePhone] = useState(initial?.guidePhone ?? '');
  const [priceAmount, setPriceAmount] = useState(
    initial?.priceAmount !== undefined ? String(initial.priceAmount) : ''
  );
  const [priceCurrency, setPriceCurrency] = useState(initial?.priceCurrency ?? 'DKK');
  const [image, setImage] = useState<Blob | undefined>(initial?.image);
  const [imageName, setImageName] = useState(initial?.imageName ?? '');
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImage(f);
    setImageName(f.name);
  };

  const save = async () => {
    setBusy(true);
    const amount = Number.parseFloat(priceAmount);
    await putTicket({
      id: slotId,
      reference: reference.trim() || undefined,
      note: note.trim() || undefined,
      image,
      imageName: imageName || undefined,
      guidePhone: guidePhone.trim() || undefined,
      priceAmount: Number.isFinite(amount) ? amount : undefined,
      priceCurrency: Number.isFinite(amount)
        ? priceCurrency.trim() || undefined
        : undefined,
    });
    setBusy(false);
    onSaved();
  };

  const removeAll = async () => {
    setBusy(true);
    await deleteTicket(slotId);
    setBusy(false);
    onSaved();
  };

  return (
    <div className="mt-3 space-y-3 border-t border-stone2-100 pt-3">
      {/* QR 圖片 */}
      <div>
        <span className="text-[11px] font-semibold text-ink-faint">QR code 圖片</span>
        {preview && (
          <div className="mt-1.5 rounded-xl border border-stone2-100 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="票券預覽" className="mx-auto max-h-56 rounded-lg" />
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={pickFile}
          className="hidden"
        />
        <div className="mt-1.5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="btn-quiet text-[13px]"
          >
            {image ? '換一張' : '從相簿選擇'}
          </button>
          {image && (
            <button
              type="button"
              onClick={() => {
                setImage(undefined);
                setImageName('');
                if (fileRef.current) fileRef.current.value = '';
              }}
              className="btn text-[13px] text-ink-faint"
            >
              移除圖片
            </button>
          )}
        </div>
      </div>

      <label className="block">
        <span className="text-[11px] font-semibold text-ink-faint">訂位／票券編號</span>
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone2-300 px-3 py-2 text-[14px]"
          placeholder="例如 ABC123"
        />
      </label>

      {hasGuideDetails && (
        <>
          <label className="block">
            <span className="text-[11px] font-semibold text-ink-faint">
              導遊／營運方電話
            </span>
            <input
              value={guidePhone}
              onChange={(e) => setGuidePhone(e.target.value)}
              type="tel"
              inputMode="tel"
              className="mt-1 w-full rounded-xl border border-stone2-300 px-3 py-2 text-[14px]"
              placeholder="填了就會出現「撥打導遊」按鈕"
            />
          </label>

          <div className="flex gap-2">
            <label className="flex-1">
              <span className="text-[11px] font-semibold text-ink-faint">已付金額</span>
              <input
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-stone2-300 px-3 py-2 text-[14px]"
                placeholder="總計"
              />
            </label>
            <label className="w-24">
              <span className="text-[11px] font-semibold text-ink-faint">幣別</span>
              <input
                value={priceCurrency}
                onChange={(e) => setPriceCurrency(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone2-300 px-3 py-2 text-[14px]"
              />
            </label>
          </div>
        </>
      )}

      <label className="block">
        <span className="text-[11px] font-semibold text-ink-faint">備註</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-stone2-300 px-3 py-2 text-[14px]"
          placeholder="例如：鑰匙盒密碼、車牌、費用明細"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={save} disabled={busy} className="btn-primary text-[13px]">
          {busy ? '儲存中…' : '存到這台裝置'}
        </button>
        <button type="button" onClick={onCancel} className="btn-quiet text-[13px]">
          取消
        </button>
        {initial && (
          <button
            type="button"
            onClick={removeAll}
            disabled={busy}
            className="btn text-[13px] text-ink-faint"
          >
            全部清除
          </button>
        )}
      </div>
    </div>
  );
}
