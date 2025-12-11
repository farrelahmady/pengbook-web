"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import moment, { Moment } from "moment";
import { cn } from "@/lib/utils";

export type DatePickerProps = {
	value: Date | Moment | undefined | null;
	onChange: (value: Date | undefined | null) => void;
	format?: string;
};

export function DatePicker({
	format = "YYYY-MM-DD",
	...props
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Moment | undefined>(
		moment(props.value)
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline-secondary"
					id="date"
					className={cn(
						"justify-between font-normal border-input h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1  shadow-xs transition-[color,box-shadow] outline-none"
					)}
				>
					{date ? date.format(format) : "Select date"}
					<ChevronDownIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto overflow-hidden p-0" align="start">
				<Calendar
					mode="single"
					selected={date?.toDate()}
					captionLayout="dropdown"
					onSelect={(date) => {
						setDate(moment(date));
						props.onChange(date);
						setOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
