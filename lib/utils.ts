import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// ── Rupiah formatter ───────────────────────────────────────────────
export function formatRupiah(
	value: number | string,
	options: { compact?: boolean; showSign?: boolean; decimals?: number } = {},
): string {
	const num = typeof value === "string" ? parseFloat(value) : value;
	const { compact = false, showSign = false, decimals = 0 } = options;
	if (isNaN(num)) return "Rp —";

	const sign = showSign && num > 0 ? "+" : "";

	if (compact) {
		if (Math.abs(num) >= 1_000_000_000)
			return `${sign}Rp ${(num / 1_000_000_000).toFixed(1)} M`;
		if (Math.abs(num) >= 1_000_000)
			return `${sign}Rp ${(num / 1_000_000).toFixed(1)} Jt`;
		if (Math.abs(num) >= 1_000)
			return `${sign}Rp ${(num / 1_000).toFixed(1)} Rb`;
	}

	const formatted = new Intl.NumberFormat("id-ID", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(Math.abs(num));

	return `${sign}${num < 0 ? "-" : ""}Rp ${formatted}`;
}

export function formatNumber(value: number | string, decimals = 0): string {
	const num = typeof value === "string" ? parseFloat(value) : value;
	if (isNaN(num)) return "—";
	return new Intl.NumberFormat("id-ID", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(num);
}

export function parseDecimal(
	value: string | number | null | undefined,
): number {
	if (value == null) return 0;
	const num = typeof value === "string" ? parseFloat(value) : value;
	return isNaN(num) ? 0 : num;
}

// ── Date formatter ─────────────────────────────────────────────────
export function formatDate(value: string | Date, fmt = "d MMMM yyyy"): string {
	try {
		const date = typeof value === "string" ? parseISO(value) : value;
		return format(date, fmt, { locale: id });
	} catch {
		return String(value);
	}
}

export function formatDateShort(value: string | Date): string {
	return formatDate(value, "d MMM yyyy");
}

export function formatTime(value: string | Date): string {
	return formatDate(value, "HH:mm");
}

export function formatDateGroup(value: string | Date): string {
	return formatDate(value, "EEEE, d MMMM yyyy");
}

// ── Accounting helpers ─────────────────────────────────────────────
export function parseDecimalSafe(v: string | number | null | undefined) {
	return parseDecimal(v);
}

export function calcJournalTotals(
	lines: Array<{ debit: number | string; credit: number | string }>,
) {
	const totalDebit = lines.reduce((s, l) => s + parseDecimal(l.debit), 0);
	const totalCredit = lines.reduce((s, l) => s + parseDecimal(l.credit), 0);
	return {
		totalDebit,
		totalCredit,
		isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
	};
}

export function isAssetAccount(code: string): boolean {
	return code.startsWith("1");
}
