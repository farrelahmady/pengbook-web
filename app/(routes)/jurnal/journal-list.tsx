"use client";
import { JournalScrollView } from "@/components/journal/journal-scroll-view";
import { useCallback, useState } from "react";

const FILTERS = ["Semua", "Hari ini", "Minggu ini", "Bulan ini"] as const;
export default function JournalList() {
	const [activeFilter, setActiveFilter] = useState<string>("Hari ini");

	const getDateRange = useCallback(() => {
		const today = new Date();
		const endOfToday = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			23,
			59,
			59,
			999,
		);
		let startDate: Date | undefined;
		let endDate: Date | undefined;

		switch (activeFilter) {
			case "Semua":
				startDate = undefined;
				endDate = undefined;
				break;
			case "Hari ini":
				startDate = today;
				endDate = endOfToday;
				break;
			case "Minggu ini":
				const firstDayOfWeek = new Date(today);
				firstDayOfWeek.setDate(today.getDate() - today.getDay());
				startDate = firstDayOfWeek;
				endDate = endOfToday;
				break;
			case "Bulan ini":
				const firstDayOfMonth = new Date(
					today.getFullYear(),
					today.getMonth(),
					1,
				);
				startDate = firstDayOfMonth;
				endDate = endOfToday;
				break;
		}

		return { startDate, endDate };
	}, [activeFilter]);

	const { startDate, endDate } = getDateRange();

	return (
		<>
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
				<JournalScrollView startDate={startDate} endDate={endDate} />
			</div>
		</>
	);
}
