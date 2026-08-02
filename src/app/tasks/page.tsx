'use client';

import { CheckItem } from '@/components/CheckItem';
import { PageHeader } from '@/components/PageHeader';
import { itinerary } from '@/data/itinerary';
import { tasks } from '@/data/tasks';
import { REGION_LABEL, shortDate } from '@/lib/dates';
import type { TaskPriority, TripTask } from '@/types/trip';
import Link from 'next/link';

const GROUPS: { priority: TaskPriority; title: string; hint: string }[] = [
  { priority: 'critical', title: '一定要處理', hint: '沒做，行程會出問題' },
  { priority: 'important', title: '重要', hint: '會影響當天順不順' },
  { priority: 'normal', title: '一般', hint: '記得就好' },
];

export default function TasksPage() {
  return (
    <main>
      <PageHeader
        eyebrow="待辦"
        title="出發前要處理的事"
        subtitle="勾選狀態只存在這台裝置。"
      />

      <div className="space-y-8 px-5 pb-10">
        {GROUPS.map((g) => {
          const list = tasks.filter((t) => t.priority === g.priority);
          if (list.length === 0) return null;
          return (
            <section key={g.priority}>
              <div className="mb-2.5">
                <h2 className="section-title">{g.title}</h2>
                <p className="mt-0.5 text-xs text-ink-faint">{g.hint}</p>
              </div>
              <div className="space-y-3">
                {list.map((t) => (
                  <TaskCard key={t.id} task={t} critical={g.priority === 'critical'} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function TaskCard({ task, critical }: { task: TripTask; critical: boolean }) {
  return (
    <article className={critical ? 'card-alert p-4' : 'card p-4'}>
      <CheckItem storageKey={`task.${task.id}`} label={task.title} emphasis={critical} />

      <div className="mt-1 flex flex-wrap items-center gap-2 pl-[28px] text-[11px] text-ink-faint">
        {task.dueDate && <span>最晚 {shortDate(task.dueDate)}</span>}
        {task.region && <span>· {REGION_LABEL[task.region]}</span>}
      </div>

      {task.description && (
        <p className="mt-2 pl-[28px] text-[13px] leading-relaxed text-ink-soft">
          {task.description}
        </p>
      )}

      {task.howTo && task.howTo.length > 0 && (
        <div className="mt-2 pl-[28px]">
          <div className="text-[11px] font-semibold text-ink-faint">怎麼做</div>
          <ul className="mt-1 space-y-1">
            {task.howTo.map((h) => (
              <li key={h} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                <span aria-hidden="true" className="text-ink-faint">
                  ·
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {task.relatedItemIds && task.relatedItemIds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 pl-[28px]">
          {task.relatedItemIds.map((id) => (
            <RelatedLink key={id} itemId={id} />
          ))}
        </div>
      )}
    </article>
  );
}

function RelatedLink({ itemId }: { itemId: string }) {
  const item = itinerary.find((i) => i.id === itemId);
  if (!item) return null;
  return (
    <Link
      href={`/day/${item.date}#${item.id}`}
      className="chip border-stone2-300 bg-white text-ink-soft"
    >
      {shortDate(item.date)} {item.title.slice(0, 14)}
      {item.title.length > 14 ? '…' : ''}
    </Link>
  );
}
