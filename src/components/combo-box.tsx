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

export type ComboBoxProps = {
	value: string | null;
	onChange: (value: string | null) => void;
	data: { value: string; label: string }[] | string[];
};

export function ComboBox({ ...props }: ComboBoxProps) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState<string | null>(props.value);
	const list: { value: string; label: string }[] = Array.isArray(props.data)
		? typeof props.data[0] === "string"
			? (props.data as string[]).map((x) => ({ value: x, label: x }))
			: (props.data as { value: string; label: string }[])
		: [];

	React.useEffect(() => {
		setValue(props.value);
	}, [props.value]);

	return (
		<div className="block w-full  relative">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline-secondary"
						role="combobox"
						aria-expanded={open}
						className="justify-between font-normal border-input h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1  shadow-xs transition-[color,box-shadow] outline-none"
					>
						<span className="truncate max-w-[85%]">
							{value
								? list.find((data) => data.value === value)?.label
								: "Select framework..."}
						</span>
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search framework..." className="h-9" />
						<CommandList>
							<CommandEmpty>No framework found.</CommandEmpty>
							<CommandGroup>
								{list.map((data) => (
									<CommandItem
										key={data.value}
										value={data.value}
										onSelect={(currentValue: string) => {
											setValue(currentValue === value ? null : currentValue);
											props.onChange(
												currentValue === value ? null : currentValue
											);
											setOpen(false);
										}}
									>
										{data.label}
										<Check
											className={cn(
												"ml-auto",
												value === data.value ? "opacity-100" : "opacity-0"
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
