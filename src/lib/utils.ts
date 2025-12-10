import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertToRupiah(number: number) {
	return new Intl.NumberFormat("id-ID", {}).format(number);
}

export function convertFromRupiah(value: string) {
	if (!value) return NaN;

	// Hilangkan Rp, spasi, dan semua titik sebagai pemisah ribuan
	const cleaned = value
		.replace(/[Rp\s]/gi, "") // buang Rp dan spasi
		.replace(/\./g, "") // buang separator ribuan
		.replace(",", "."); // ganti koma menjadi titik decimal

	const num = Number(cleaned);

	return Number.isNaN(num) ? NaN : num;
}
