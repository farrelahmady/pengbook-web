import { dummyJournals } from "@/lib/dummy-data";
import { JournalEntry, JournalSummary } from "@/types";

export const journalService = {
	getAllScrollView: async (request: {
		page: number;
		limit: number;
	}): Promise<JournalEntry[]> => {
		const start = request.page * request.limit - request.limit;

		// Delay to simulate network latency
		await new Promise((resolve) => setTimeout(resolve, 2000));
		// Dummy first
		return Promise.resolve(dummyJournals.slice(start, start + request.limit));
		// return Promise.resolve([]);
	},

	getTotalSummary: async (): Promise<JournalSummary> => {
		// Dummy data, replace with actual API call
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
		return {
			totalDebit: dummyJournals.reduce(
				(sum, j) => sum + j.lines.reduce((s, l) => s + parseFloat(l.debit), 0),
				0,
			),
			totalCredit: dummyJournals.reduce(
				(sum, j) => sum + j.lines.reduce((s, l) => s + parseFloat(l.credit), 0),
				0,
			),
			transactionCount: dummyJournals.length,
		};
	},
};
