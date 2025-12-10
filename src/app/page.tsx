"use client";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/date-picker";
import { JsonView } from "@/components/json-view";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { convertFromRupiah, convertToRupiah } from "@/lib/utils";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
	const [data, setData] = useState([
		{
			date: moment("2025-11-30"),
			from: "11.01.01 - Mandiri - Main",
			to: "61.01.01 - Reclass Adjustments",
			amount: 75626,
			note: "Adjustment",
		},
		{
			date: moment("2025-11-30"),
			from: "11.03.03 - Dipay",
			to: "61.01.01 - Reclass Adjustments",
			amount: 593473,
			note: "Adjustment",
		},
		{
			date: moment("2025-11-30"),
			from: "11.01.03 - Jago - Main",
			to: "61.01.01 - Reclass Adjustments",
			amount: 6403971,
			note: "Adjustment",
		},
		{
			date: moment("2025-11-30"),
			from: "11.01.03 - Jago - Main",
			to: "51.01.03 - Toiletries",
			amount: 18900,
			note: "Shampoo",
		},
		{
			date: moment("2025-11-30"),
			from: "11.01.03 - Jago - Main",
			to: "52.01.03 - Snack",
			amount: 17000,
			note: "Fit me up",
		},
	]);

	return (
		<div className="p-24">
			<Table className="bg-secondary">
				<TableCaption>A list of your recent invoices.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[5%]">Date</TableHead>
						<TableHead className="w-[15%]">From</TableHead>
						<TableHead className="w-[15%]">To</TableHead>
						<TableHead className="w-[10%]">Amount</TableHead>
						<TableHead>Note</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((item, i) => (
						<TableRow key={i}>
							<TableCell className="w-fit">
								<DatePicker
									onChange={(date) => {
										item.date = moment(date);
										setData([...data]);
									}}
									value={item.date}
								/>
							</TableCell>
							<TableCell>
								<Input
									value={item.from}
									onChange={(value) => {
										item.from = value.target.value;
										setData([...data]);
									}}
								/>
							</TableCell>
							<TableCell>{item.to}</TableCell>
							<TableCell className="text-right">
								<Input
									leftIcon={<span>Rp</span>}
									value={convertToRupiah(item.amount)}
									className="text-right"
									onChange={(value) => {
										const num =
											value.target.value === ""
												? 0
												: Number(convertFromRupiah(value.target.value));
										item.amount = !Number.isNaN(num) ? num : item.amount;
										setData([...data]);
									}}
								/>
							</TableCell>
							<TableCell>
								<Textarea defaultValue={item.note} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<JsonView
				src={data.map((item) => ({
					...item,
					date: item.date.toDate(),
				}))}
			/>
		</div>
	);
}
