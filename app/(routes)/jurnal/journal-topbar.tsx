"use client";
import {
	PeriodBadge,
	Topbar,
	TopbarSummaryCard,
} from "@/components/layout/topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { LOCALE } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";
import { journalService } from "@/services/journal";
import { useQuery } from "@tanstack/react-query";

export default function JournalTopbar() {
	const { data, isLoading } = useQuery({
		queryKey: ["journalSummary"],
		queryFn: () => journalService.getTotalSummary(),
	});

	const labelPeriod = new Date().toLocaleDateString(LOCALE, {
		month: "short",
		year: "numeric",
	});
	return (
		<>
			{/* ── Topbar ── */}
			<Topbar
				subtitle="Buku Jurnal"
				right={<PeriodBadge label={labelPeriod} />}
			>
				<div className="flex gap-2 mt-4">
					<TopbarSummaryCard
						label="Total Debit"
						value={
							isLoading ? (
								<Skeleton className="w-16 h-3 rounded" />
							) : (
								formatRupiah(data?.totalDebit ?? 0, { compact: true })
							)
						}
					/>
					<TopbarSummaryCard
						label="Total Kredit"
						value={
							isLoading ? (
								<Skeleton className="w-16 h-3 rounded" />
							) : (
								formatRupiah(data?.totalCredit ?? 0, { compact: true })
							)
						}
					/>
					<TopbarSummaryCard
						label="Transaksi"
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
