import { SxProps, Theme } from "@mui/material/styles";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertToRupiah(number: number | null | undefined) {
	return number != null && number != undefined
		? new Intl.NumberFormat("id-ID", {}).format(number)
		: "";
}

export function convertFromRupiah(value: string) {
	if (!value) return NaN;

	// Hilangkan Rp, spasi, dan semua titik sebagai pemisah ribuan
	const cleaned = value
		.replace(/[Rp\s]/gi, "") // buang Rp dan spasi
		.replace(/[^\d,-]/g, "") // hanya angka, koma dan minus
		.replace(/\./g, "") // hilangkan pemisah ribuan
		.replace(",", "."); // ubah koma menjadi decimal valid

	const num = Number(cleaned);

	return Number.isNaN(num) ? NaN : num;
}

export function allowNumberCommaDotOnly(
	e: React.KeyboardEvent<HTMLInputElement>
) {
	const key = e.key.toLowerCase();

	const allowedControlKeys = [
		"backspace",
		"delete",
		"arrowleft",
		"arrowright",
		"tab",
		"home",
		"end",
	];

	// Always allow navigation keys (Backspace, arrows, etc.)
	if (allowedControlKeys.includes(key)) return;

	// Allow ctrl shortcuts
	if (e.ctrlKey) {
		if (["a", "c", "v", "x", "z", "y"].includes(key)) return;
	}

	// Allow numbers
	if (/^[0-9]$/.test(e.key)) return;

	// Allow comma and dot
	if (e.key === "," || e.key === ".") return;

	// Block everything else
	e.preventDefault();
}

export const iconSetting: SxProps<Theme> = {
	fontSize: { xs: 12, sm: 12, md: 16, lg: 20 },
};

export function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
	return obj[key];
}
