import axios from "axios";
import type {
	ApiResponse,
	ChartOfAccount,
	ChartOfAccountWithChildren,
	CreateCoaDto,
	JournalEntry,
	CreateJournalDto,
} from "@/types";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
	headers: { "Content-Type": "application/json" },
	timeout: 10_000,
});

api.interceptors.response.use(
	(r) => r,
	(err) =>
		Promise.reject(new Error(err.response?.data?.message ?? err.message)),
);

export const coaService = {
	getAll: async (
		query?: Record<string, unknown>,
	): Promise<ChartOfAccount[]> => {
		const res = await api.get<ApiResponse<ChartOfAccount[]>>("/coa", {
			params: query,
		});
		return res.data.data;
	},
	getTree: async (): Promise<ChartOfAccountWithChildren[]> => {
		const res =
			await api.get<ApiResponse<ChartOfAccountWithChildren[]>>("/coa/tree");
		return res.data.data;
	},
	create: async (dto: CreateCoaDto): Promise<ChartOfAccount> => {
		const res = await api.post<ApiResponse<ChartOfAccount>>("/coa", dto);
		return res.data.data;
	},
	getPostingAccounts: () => coaService.getAll({ posting: true }),
};

export const journalService = {
	getAll: async (): Promise<JournalEntry[]> => {
		const res = await api.get<ApiResponse<JournalEntry[]>>("/journal");
		return res.data.data;
	},
	getById: async (id: string): Promise<JournalEntry> => {
		const res = await api.get<ApiResponse<JournalEntry>>(`/journal/${id}`);
		return res.data.data;
	},
	create: async (dto: CreateJournalDto): Promise<JournalEntry> => {
		const res = await api.post<ApiResponse<JournalEntry>>("/journal", dto);
		return res.data.data;
	},
	importExcel: async (file: File): Promise<void> => {
		const form = new FormData();
		form.append("file", file);
		await api.post("/journal/import", form, {
			headers: { "Content-Type": "multipart/form-data" },
		});
	},
	buildBasicDto: (form: {
		date: string;
		description: string;
		fromAccount: string;
		toAccount: string;
		amount: number;
	}): CreateJournalDto => ({
		date: form.date,
		description: form.description,
		lines: [
			{ accountId: form.toAccount, debit: form.amount, credit: 0 },
			{ accountId: form.fromAccount, debit: 0, credit: form.amount },
		],
	}),
};

export default api;
