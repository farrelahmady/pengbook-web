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
	value: Date | Moment | undefined;
	onChange: (value: Date | undefined) => void;
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
					variant="outline"
					id="date"
					className={cn("justify-between font-normal")}
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
