"use client";
import { JournalScrollView } from "@/components/journal/journal-scroll-view";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

const FILTERS = ["all", "today", "week", "month"] as const;
export default function JournalList() {
	const t = useTranslations("journalPage");
	const [activeFilter, setActiveFilter] = useState<string>("today");

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
			case "all":
				startDate = undefined;
				endDate = undefined;
				break;
			case "today":
				startDate = today;
				endDate = endOfToday;
				break;
			case "week":
				const firstDayOfWeek = new Date(today);
				firstDayOfWeek.setDate(today.getDate() - today.getDay());
				startDate = firstDayOfWeek;
				endDate = endOfToday;
				break;
			case "month":
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
						{t(`transactionFilterChips.${f}`)}
					</button>
				))}
			</div>

			{/* ── List ── */}
			<div className="px-1">
				<p className="section-label">{t("listTitle")}</p>
				<JournalScrollView startDate={startDate} endDate={endDate} />
			</div>
		</>
	);
}
