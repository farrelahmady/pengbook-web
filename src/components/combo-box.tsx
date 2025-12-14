"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export type ComboBoxOption = {
	value: string;
	label: string;
};

export type ComboBoxProps = {
	value: string | null;
	onChange: (value: string | null) => void;
	data: () => Promise<ComboBoxOption[] | string[]>;
};

export function ComboBox(props: ComboBoxProps) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState<string | null>(props.value);
	const [list, setList] = React.useState<ComboBoxOption[]>([]);
	const [loading, setLoading] = React.useState(false);

	/* ----------------------------- sync value ----------------------------- */
	React.useEffect(() => {
		setValue(props.value);
	}, [props.value]);

	/* ----------------------------- fetch data ----------------------------- */
	React.useEffect(() => {
		let mounted = true;

		async function load() {
			setLoading(true);
			const data = await props.data();

			if (!mounted) return;

			const normalized: ComboBoxOption[] = Array.isArray(data)
				? typeof data[0] === "string"
					? (data as string[]).map((x) => ({ value: x, label: x }))
					: (data as ComboBoxOption[])
				: [];

			setList(normalized);
			setLoading(false);
		}

		load();

		return () => {
			mounted = false;
		};
	}, [props.data]);

	/* ------------------------------ render ------------------------------ */

	return (
		<div className="relative w-full">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline-secondary"
						role="combobox"
						aria-expanded={open}
						className="flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm"
						disabled={loading}
					>
						<span className="truncate max-w-[85%]">
							{value
								? list.find((x) => x.value === value)?.label
								: loading
								? "Loading..."
								: "Select option"}
						</span>
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>

				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search..." className="h-9" />
						<CommandList>
							<CommandEmpty>No data found.</CommandEmpty>
							<CommandGroup>
								{list.map((item) => (
									<CommandItem
										key={item.value}
										value={item.value}
										onSelect={(currentValue) => {
											const next = currentValue === value ? null : currentValue;

											setValue(next);
											props.onChange(next);
											setOpen(false);
										}}
									>
										{item.label}
										<Check
											className={cn(
												"ml-auto",
												value === item.value ? "opacity-100" : "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
