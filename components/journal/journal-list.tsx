import { JournalEntry } from "@/types";
import { JournalCard } from "./journal-card";
import { formatDateGroup, parseDecimal } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { ReceiptText } from "lucide-react";

interface JournalListProps {
  journals: JournalEntry[];
}

function groupByDate(journals: JournalEntry[]) {
  const map = new Map<string, JournalEntry[]>();
  for (const j of journals) {
    const key = j.date.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(j);
  }
  return map;
}

export function JournalList({ journals }: JournalListProps) {
  if (!journals.length) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="Belum ada transaksi"
        description="Tap tombol Buat Transaksi untuk mencatat jurnal pertama Anda."
      />
    );
  }

  const grouped = groupByDate(journals);

  return (
    <div className="flex flex-col gap-2 px-3 pb-4">
      {Array.from(grouped.entries()).map(([date, entries]) => (
        <div key={date}>
          {/* Date group header */}
          <p className="text-[11px] font-semibold text-secondary-400 tracking-wide px-1 pt-3 pb-1.5">
            {formatDateGroup(date)}
          </p>

          <div className="flex flex-col gap-2">
            {entries.map((journal) => (
              <JournalCard key={journal.id} journal={journal} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
