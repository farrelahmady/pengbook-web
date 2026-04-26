"use client";

import { JournalEntry } from "@/types";
import { formatTime, formatRupiah, parseDecimal } from "@/lib/utils";
import { DrBadge, CrBadge, DrCrDot } from "@/components/shared/dbcr-badge";
import { cn } from "@/lib/utils";

interface JournalCardProps {
  journal: JournalEntry;
}

export function JournalCard({ journal }: JournalCardProps) {
  // Hitung total debit utama untuk tampilan amount
  const totalDebit = journal.lines.reduce(
    (s, l) => s + parseDecimal(l.debit),
    0,
  );
  const totalCredit = journal.lines.reduce(
    (s, l) => s + parseDecimal(l.credit),
    0,
  );
  // Jika lebih banyak kredit, ini transaksi masuk
  const isInflow = totalCredit > totalDebit;
  const displayAmount = Math.max(totalDebit, totalCredit);

  return (
    <div className="card-default shadow-card active:scale-[0.99] transition-transform cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-3.5 pb-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-[14px] font-semibold text-secondary-900 leading-snug truncate">
            {journal.description ?? "—"}
          </p>
          <p className="font-mono text-[10px] text-secondary-400 mt-0.5">
            {formatTime(journal.date)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p
            className={cn(
              "font-mono text-[15px] font-semibold",
              isInflow ? "text-success-600" : "text-danger-600",
            )}
          >
            {isInflow ? "+" : "-"}
            {formatRupiah(displayAmount, { compact: true })}
          </p>
        </div>
      </div>

      {/* Lines */}
      <div className="border-t border-black/[0.06] px-4 py-2.5 flex flex-col gap-2">
        {journal.lines.map((line) => {
          const isDr = parseDecimal(line.debit) > 0;
          const amount = isDr
            ? parseDecimal(line.debit)
            : parseDecimal(line.credit);
          return (
            <div
              key={line.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <DrCrDot type={isDr ? "dr" : "cr"} />
                <span className="text-[12px] text-secondary-500 truncate">
                  {line.account?.code} · {line.account?.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {isDr ? <DrBadge /> : <CrBadge />}
                <span
                  className={cn(
                    "font-mono text-[11px] font-medium",
                    isDr ? "text-danger-600" : "text-success-600",
                  )}
                >
                  {formatRupiah(amount, { compact: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
