"use client";
import { JournalEntry } from "@/types";
import { JournalCard, JournalCardSkeleton } from "./journal-card";
import { formatDateGroup, parseDecimal } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { ReceiptText } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { journalService } from "@/services/journal";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";

interface JournalScrollViewProps {
	startDate?: Date;
	endDate?: Date;
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

export function JournalScrollView({
	startDate,
	endDate,
}: JournalScrollViewProps) {
	const observerRef = useRef<HTMLDivElement>(null);
	const LIMIT = 3; // Number of journals to fetch per page

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useInfiniteQuery({
			queryKey: ["journals", "scroll-view", { startDate, endDate }],
			queryFn: ({ pageParam }) => {
				console.log("Fetching Journal for Page", pageParam);

				return journalService.getAllScrollView({
					page: pageParam,
					limit: LIMIT,
				});
			},
			initialPageParam: 1,
			getNextPageParam: (lastPage, allPages) => {
				console.log(
					"Last Page Length:",
					lastPage.length,
					"All Pages Length:",
					allPages.length,
				);
				// Stop paginating once the last page returns fewer items than the limit
				if (!lastPage || lastPage.length < LIMIT) return undefined;
				return allPages.length + 1;
			},
		});

	const journals = useMemo(() => {
		if (!data) return [];
		return data.pages.flat();
	}, [data]);

	const grouped = useMemo(() => groupByDate(journals), [journals]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{
				threshold: 0,
				rootMargin: "100px",
			},
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	return (
		<>
			<div className="flex flex-col gap-2 px-3 pb-4">
				<JournalScrollViewContent
					isLoading={isLoading}
					journals={journals}
					grouped={grouped}
					isFetchingNextPage={isFetchingNextPage}
					observerRef={observerRef}
				/>
			</div>
		</>
	);
}

function JournalScrollViewContent({
	isLoading,
	journals,
	grouped,
	isFetchingNextPage,
	observerRef,
}: {
	isLoading: boolean;
	journals: JournalEntry[];
	grouped: Map<string, JournalEntry[]>;
	isFetchingNextPage: boolean;
	observerRef: React.RefObject<HTMLDivElement | null>;
}) {
	const format = useFormatter();
	const t = useTranslations("journalPage");

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<JournalCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (journals.length === 0) {
		return (
			<EmptyState
				icon={ReceiptText}
				title={t("emptyTitle")}
				description={t("emptyDescription")}
			/>
		);
	}

	return (
		<>
			{Array.from(grouped.entries()).map(([date, entries]) => (
				<div key={date}>
					<p className="text-[11px] font-semibold text-secondary-400 tracking-wide px-1 pt-3 pb-1.5">
						{format.dateTime(new Date(date), {
							weekday: "long",
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</p>
					<div className="flex flex-col gap-2">
						{entries.map((journal) => (
							<JournalCard key={journal.id} journal={journal} />
						))}
					</div>
				</div>
			))}
			{isFetchingNextPage && (
				<p className="text-center text-[12px] text-secondary-400 py-2">
					{t("loadingMore")}
				</p>
			)}
			<div ref={observerRef} className="h-1" />
		</>
	);
}
