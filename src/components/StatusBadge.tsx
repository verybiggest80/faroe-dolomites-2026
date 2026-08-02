import { STATUS_CLASS, STATUS_LABEL } from '@/lib/trip';
import type { ItemStatus } from '@/types/trip';

export function StatusBadge({ status }: { status: ItemStatus }) {
  return <span className={`chip ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function StatusBadges({ statuses }: { statuses: ItemStatus[] }) {
  const visible = statuses.filter((s) => s !== 'backup_only');
  if (visible.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((s) => (
        <StatusBadge key={s} status={s} />
      ))}
    </div>
  );
}
