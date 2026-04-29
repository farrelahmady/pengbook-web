"use client";

import { useState } from "react";
import {
  Topbar,
  PeriodBadge,
  TopbarSummaryCard,
} from "@/components/layout/topbar";
import { JournalList } from "@/components/journal/journal-list";
import { CreateJournalSheet } from "@/components/journal/create-journal-sheet";
import { dummyJournals } from "@/lib/dummy-data";
import { Plus } from "lucide-react";

const FILTERS = ["Semua", "Hari ini", "Minggu ini", "Bulan ini"] as const;

export default function JurnalPage() {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [sheetOpen, setSheetOpen] = useState(false);

  const totalDebit = dummyJournals.reduce(
    (sum, j) => sum + j.lines.reduce((s, l) => s + parseFloat(l.debit), 0),
    0,
  );
  const totalCredit = dummyJournals.reduce(
    (sum, j) => sum + j.lines.reduce((s, l) => s + parseFloat(l.credit), 0),
    0,
  );

  return (
    <>
      {/* ── Topbar ── */}
      <Topbar subtitle="Buku Jurnal" right={<PeriodBadge label="Apr 2026" />}>
        <div className="flex gap-2 mt-4">
          <TopbarSummaryCard
            label="Total Debit"
            value={`Rp ${(totalDebit / 1_000_000).toFixed(1)} Jt`}
          />
          <TopbarSummaryCard
            label="Total Kredit"
            value={`Rp ${(totalCredit / 1_000_000).toFixed(1)} Jt`}
          />
          <TopbarSummaryCard
            label="Transaksi"
            value={`${dummyJournals.length}`}
            accent
          />
        </div>
      </Topbar>

      {/* ── Filter chips ── */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={[
              "shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all no-tap",
              activeFilter === f
                ? "bg-primary-500 text-white border-primary-500"
                : "bg-white text-secondary-500 border-secondary-200 hover:border-primary-300",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      <div className="px-1">
        <p className="section-label">Riwayat Transaksi</p>
        <JournalList journals={dummyJournals} />
      </div>

      {/* ── FAB ── */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-22 left-1/2 -translate-x-1/2 z-30
                   flex items-center gap-2 px-6 py-3.5 rounded-2xl
                   bg-primary-500 text-white font-semibold text-[14px]
                   shadow-[0_4px_20px_rgba(59,79,212,0.4)]
                   active:scale-95 transition-transform no-tap"
      >
        <Plus size={18} strokeWidth={2.5} />
        Buat Transaksi
      </button>

      {/* ── Sheet ── */}
      <CreateJournalSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}
