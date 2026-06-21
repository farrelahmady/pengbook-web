"use client";
import {
	PeriodBadge,
	Topbar,
	TopbarSummaryCard,
} from "@/components/layout/topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrencyFormatter } from "@/hooks/use-currency-formatter";
import { journalService } from "@/services/journal";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";

export default function JournalTopbar() {
	const t = useTranslations();
	const format = useFormatter();
	const currencyFormat = useCurrencyFormatter();
	const { data, isLoading } = useQuery({
		queryKey: ["journalSummary"],
		queryFn: () => journalService.getTotalSummary(),
	});

	const labelPeriod = format.dateTime(new Date(), {
		month: "short",
		year: "numeric",
	});

	return (
		<>
			{/* ── Topbar ── */}
			<Topbar
				subtitle={t("journalPage.title")}
				right={<PeriodBadge label={labelPeriod} />}
			>
				<div className="flex gap-2 mt-4">
					<TopbarSummaryCard
						label={t("journalPage.summaryDebit.label")}
						value={
							isLoading ? (
								<Skeleton className="w-16 h-3 rounded" />
							) : (
								currencyFormat(data?.totalDebit ?? 0, {
									compact: true,
									currency: "Rp",
								})
							)
						}
					/>
					<TopbarSummaryCard
						label={t("journalPage.summaryCredit.label")}
						value={
							isLoading ? (
								<Skeleton className="w-16 h-3 rounded" />
							) : (
								currencyFormat(data?.totalCredit ?? 0, {
									compact: true,
									currency: "Rp",
								})
							)
						}
					/>
					<TopbarSummaryCard
						label={t("journalPage.summarytransaction.label")}
						value={
							isLoading ? (
								<Skeleton className="w-16 h-3 rounded" />
							) : (
								`${data?.transactionCount ?? 0}`
							)
						}
						accent
					/>
				</div>
			</Topbar>
		</>
	);
}
