"use client";
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
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/currency-input";
import { ComboBox } from "@/components/combo-box";
import {
	masterChartOfAccounts,
	Transaction,
	transactionList,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { iconSetting } from "@/lib/utils";

export default function Home() {
	const [rows, setRows] = useState(transactionList);

	function addRow() {
		setRows((prev) => [
			{
				id: null,
				date: new Date(),
				from: null,
				to: null,
				amount: null,
				note: null,
				key: crypto.randomUUID(),
				status: "new",
			},
			...prev,
		]);
	}

	function cancelAddRow(id: string) {
		setRows((prev) => prev.filter((r) => r.key !== id));
	}

	function updateRow(id: string, patch: Partial<Transaction>) {
		setRows((prev) =>
			prev.map((r) => {
				if (r.key !== id) return r;

				const newStatus = r.status === "existing" ? "updated" : r.status;

				return { ...r, ...patch, status: newStatus };
			})
		);
	}

	function cancelUpdateRow(id: string) {
		const orig = transactionList.find((r) => r.key === id);
		if (orig) {
			setRows((prev) => {
				return prev.map((r) => {
					if (r.key !== id) return r;
					return { ...r, ...orig, status: "existing" };
				});
			});
		}
	}

	return (
		<div className="p-24">
			<div className="w-full flex flex-col bg-secondary/50 rounded-md p-4">
				<div className="flex justify-between items-end border-b pb-2">
					<div className="flex gap-3">
						<h3 className="text-2xl font-bold">Transaction</h3>
					</div>
					<div className="flex gap-1">
						<Button variant={"primary"} onClick={addRow}>
							<AddIcon sx={iconSetting} />
							New
						</Button>
						{rows.some((r) => r.status === "new" || r.status === "updated") && (
							<Button variant={"primary"}>
								<SaveIcon sx={iconSetting} /> Save All
							</Button>
						)}
					</div>
				</div>
				<div>
					<Table className="w-full table-fixed overflow-auto">
						<TableHeader>
							<TableRow>
								<TableHead className="w-[8%]">Date</TableHead>
								<TableHead className="w-[10%]">From</TableHead>
								<TableHead className="w-[10%]">To</TableHead>
								<TableHead className="w-[10%]">Amount</TableHead>
								<TableHead>Note</TableHead>
								<TableHead className="w-28">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((item, i) => (
								<TableRow key={item.key}>
									<TableCell>
										<DatePicker
											onChange={(date) => {
												updateRow(item.key, { date });
											}}
											value={item.date}
										/>
									</TableCell>
									<TableCell>
										<ComboBox
											data={masterChartOfAccounts}
											value={item.from}
											onChange={(value) => {
												updateRow(item.key, { from: value });
											}}
										/>
									</TableCell>
									<TableCell>
										<ComboBox
											data={masterChartOfAccounts}
											value={item.to}
											onChange={(value) => {
												updateRow(item.key, { to: value });
											}}
										/>
									</TableCell>
									<TableCell className="text-right">
										<CurrencyInput
											value={item.amount}
											onChange={(value) => {
												updateRow(item.key, { amount: value });
											}}
										/>
									</TableCell>
									<TableCell>
										<Textarea
											value={item.note || ""}
											onChange={(e) =>
												updateRow(item.key, { note: e.target.value })
											}
										/>
									</TableCell>
									<TableCell>
										<div className="flex gap-1 justify-center w-full">
											{item.status === "new" && (
												<>
													<Button variant={"primary"}>
														<SaveIcon sx={iconSetting} />
													</Button>
													<Button
														variant={"destructive"}
														onClick={() => cancelAddRow(item.key)}
													>
														<CancelIcon sx={iconSetting} />
													</Button>
												</>
											)}
											{item.status === "updated" && (
												<>
													<Button variant={"primary"}>
														<SaveIcon sx={iconSetting} />
													</Button>
													<Button
														variant={"destructive"}
														onClick={() => cancelUpdateRow(item.key)}
													>
														<CancelIcon sx={iconSetting} />
													</Button>
												</>
											)}
											{item.status === "existing" && (
												<Button variant={"destructive"} className="w-full ">
													<DeleteIcon sx={iconSetting} />
												</Button>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
			<JsonView src={rows.filter((x) => x.status === "updated")} />
			<JsonView src={rows.filter((x) => x.status === "existing")} />
			<JsonView src={rows.filter((x) => x.status === "new")} />
		</div>
	);
}
