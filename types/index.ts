// API wrapper
export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
	meta?: { timestamp: string; path?: string };
}

// COA
export type AccountType =
	| "ASSET"
	| "LIABILITY"
	| "EQUITY"
	| "REVENUE"
	| "EXPENSE"
	| "OTHER";

export interface ChartOfAccount {
	id: string;
	code: string;
	name: string;
	type: AccountType;
	isPosting: boolean;
	parentId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ChartOfAccountWithChildren extends ChartOfAccount {
	children: ChartOfAccountWithChildren[];
}

export interface CreateCoaDto {
	code: string;
	name: string;
	type: AccountType;
	parentId?: string;
}

// Journal
export interface JournalEntryLine {
	id: string;
	journalEntryId: string;
	accountId: string;
	debit: string;
	credit: string;
	account?: ChartOfAccount;
}

export interface JournalEntry {
	id: string;
	date: string;
	description: string | null;
	lines: JournalEntryLine[];
	createdAt: string;
	updatedAt: string;
}

export interface JournalLineDto {
	accountId: string;
	debit: number;
	credit: number;
}

export interface CreateJournalDto {
	date: string;
	description?: string;
	lines: JournalLineDto[];
}

export type JournalMode = "basic" | "advanced";
export type NavTab = "jurnal" | "aset" | "laporan" | "akun";
