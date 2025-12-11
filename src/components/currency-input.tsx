"use client";

import { useState, useEffect, useRef } from "react";
import {
	allowNumberCommaDotOnly,
	cn,
	convertFromRupiah,
	convertToRupiah,
} from "@/lib/utils";
import { Input } from "./ui/input";

export type CurrencyInputProps = Omit<
	React.ComponentProps<"input">,
	"onChange" | "value"
> & {
	value: number | null;
	onChange: (value: number | null) => void;
};

export function CurrencyInput({
	value,
	onChange,
	className,
	placeholder = "-",
}: CurrencyInputProps) {
	const [text, setText] = useState<string | null>("");
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (ref.current) {
			const formatted = convertToRupiah(value);

			// Simpan posisi cursor lama
			const { selectionStart } = ref.current;

			setText(formatted);

			setTimeout(() => {
				if (!selectionStart) return;

				// hitung jumlah delimiter
				const delimiterCount = formatted.split(",").length;

				// Pindahkan posisi cursor
				ref.current!.setSelectionRange(
					selectionStart + delimiterCount,
					selectionStart + delimiterCount
				);
			});
		}
	}, [value]);

	return (
		<Input
			ref={ref}
			leftIcon="Rp"
			value={text || ""}
			placeholder={placeholder}
			onCopy={(e) => {
				e.preventDefault(); // block default copy

				// convert formatted Rupiah to number
				const numericValue = convertFromRupiah(text ?? "");

				// write raw number into clipboard
				e.clipboardData.setData(
					"text/plain",
					numericValue.toString().replace(".", ",")
				);
			}}
			onKeyDown={allowNumberCommaDotOnly}
			onChange={(e) => {
				const raw = e.target.value;

				setText(raw);

				const parsed = convertFromRupiah(raw);

				if (raw === "") {
					onChange(null);
				} else if (!Number.isNaN(parsed)) {
					onChange(parsed);
				}
			}}
			onBlur={() => {
				setText(convertToRupiah(value));
			}}
			className={cn(className)}
		/>
	);
}
