"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import {
	allowNumberCommaDotOnly,
	convertFromRupiah,
	convertToRupiah,
} from "@/lib/utils";

export type CurrencyInputProps = {
	value: number | null;
	onCommit: (value: number | null) => void;
};

export function CurrencyInput({ value, onCommit }: CurrencyInputProps) {
	const [text, setText] = useState("");
	const ref = useRef<HTMLInputElement>(null);

	// sync hanya saat value berubah dari luar
	useEffect(() => {
		setText(convertToRupiah(value));
		// setText(value != null ? value.toString() : "");
	}, [value]);

	return (
		<Input
			ref={ref}
			leftIcon="Rp"
			value={text}
			onKeyDown={allowNumberCommaDotOnly}
			onChange={(e) => {
				// ⛔ JANGAN update parent
				setText(e.target.value);
			}}
			onFocus={() => {
				setText(convertFromRupiah(text).toString().replace(".", ","));
			}}
			onBlur={() => {
				const parsed = convertFromRupiah(text);
				onCommit(Number.isNaN(parsed) ? null : parsed);
			}}
		/>
	);
}
