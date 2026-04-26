"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { BasicForm } from "./basic-form";
import { AdvancedForm } from "./advanced-form";
import { cn } from "@/lib/utils";

interface CreateJournalSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

type Mode = "basic" | "advanced";

export function CreateJournalSheet({
  open,
  onOpenChange,
}: CreateJournalSheetProps) {
  const [mode, setMode] = useState<Mode>("basic");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="p-0 rounded-t-3xl max-w-[390px] mx-auto max-h-[92dvh] overflow-y-auto"
      >
        {/* Handle */}
        <div className="sheet-handle" />

        {/* Header */}
        <div className="px-5 pt-3 pb-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-bold text-secondary-900">
              Buat Transaksi
            </h2>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-secondary-100 rounded-xl p-1 gap-1 mb-4">
            {(["basic", "advanced"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all no-tap capitalize",
                  mode === m
                    ? "bg-white text-secondary-900 shadow-sm"
                    : "text-secondary-400 hover:text-secondary-600",
                )}
              >
                {m === "basic" ? "Basic" : "Advanced"}
              </button>
            ))}
          </div>

          <div className="h-px bg-black/[0.06] -mx-5 mb-4" />
        </div>

        {/* Form */}
        <div className="px-5 pb-8">
          {mode === "basic" ? (
            <BasicForm onSuccess={() => onOpenChange(false)} />
          ) : (
            <AdvancedForm onSuccess={() => onOpenChange(false)} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
