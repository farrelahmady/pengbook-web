"use client";
import { ComboBox } from "@/components/combo-box";
import { CurrencyInput } from "@/components/currency-input";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { masterChartOfAccounts, Pagination, Transaction } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { iconSetting } from "@/lib/utils";
import React, { useEffect } from "react";
import { ColumnConfig, DataTable } from "@/components/datatable";

export type TransactionListProps = {
	data: Transaction[];
	pagination: Pagination;
};

export type TransactionColumns = {
	updateRow: (key: string, patch: Partial<Transaction>) => void;
	cancelAddRow: (key: string) => void;
	cancelUpdateRow: (key: string) => void;
};

export function getColumns({
	updateRow,
	cancelAddRow,
	cancelUpdateRow,
}: TransactionColumns) {
	const columns: ColumnConfig<Transaction>[] = [
		{
			key: "date",
			label: "Date",
			inputType: "date",
			minSize: 100,
		},
		{
			key: "from",
			label: "From",
			size: 100,
			minSize: 200,
			inputType: "combo-box",
			dataSource() {
				return Promise.resolve(masterChartOfAccounts);
			},
		},
		{
			key: "to",
			label: "To",
			size: 100,
			minSize: 200,
			inputType: "combo-box",
			dataSource() {
				return Promise.resolve(masterChartOfAccounts);
			},
		},
		{
			key: "amount",
			label: "Amount",
			inputType: "currency",
			size: 100,
			minSize: 200,
		},
		{
			key: "note",
			label: "Note",
			size: 100,
			minSize: 400,
			inputType: "textarea",
		},
		// {
		// 	id: "actions",
		// 	label: () => <div className="text-center">Action</div>,
		// 	meta: { sticky: true },
		// 	cell: ({ row }) => {
		// 		const item = row.original;

		// 		return (
		// 			<div className="flex gap-1 justify-center w-full">
		// 				{item.status === "new" && (
		// 					<>
		// 						<Button size={"icon-sm"} variant={"ghost"}>
		// 							<SaveIcon sx={iconSetting} />
		// 						</Button>
		// 						<Button
		// 							size={"icon-sm"}
		// 							variant={"destructive"}
		// 							onClick={() => cancelAddRow(item.key)}
		// 						>
		// 							<CancelIcon sx={iconSetting} />
		// 						</Button>
		// 					</>
		// 				)}
		// 				{item.status === "updated" && (
		// 					<>
		// 						<Button size={"icon-sm"} variant={"primary"}>
		// 							<SaveIcon sx={iconSetting} />
		// 						</Button>
		// 						<Button
		// 							size={"icon-sm"}
		// 							variant={"destructive"}
		// 							onClick={() => cancelUpdateRow(item.key)}
		// 						>
		// 							<CancelIcon sx={iconSetting} />
		// 						</Button>
		// 					</>
		// 				)}
		// 				{item.status === "existing" && (
		// 					<Button size={"icon-sm"} variant={"ghost"}>
		// 						<DeleteIcon sx={iconSetting} className="text-destructive" />
		// 					</Button>
		// 				)}
		// 			</div>
		// 		);
		// 	},
		// 	size: 50,
		// },
	];

	return columns;
}

export function TransactionList(props: TransactionListProps) {
	const [rows, setRows] = React.useState(props.data);

	useEffect(() => {
		setRows(props.data);
	}, [props.data]);

	const columns = getColumns({
		updateRow: updateRow,
		cancelAddRow: cancelAddRow,
		cancelUpdateRow: cancelUpdateRow,
	});

	function addRow() {
		setRows((prev) => [
			{
				id: null,
				date: new Date(),
				from: null,
				to: null,
				amount: null,
				note: null,
				uid: crypto.randomUUID(),
				status: "new",
			},
			...prev,
		]);
	}

	function cancelAddRow(id: string) {
		setRows((prev) => prev.filter((r) => r.uid !== id));
	}

	function updateRow(id: string, patch: Partial<Transaction>) {
		setRows((prev) =>
			prev.map((r) => {
				if (r.uid !== id) return r;

				const newStatus = r.status === "existing" ? "updated" : r.status;

				return { ...r, ...patch, status: newStatus };
			})
		);
	}

	function cancelUpdateRow(id: string) {
		const orig = props.data.find((r) => r.uid === id);
		if (orig) {
			setRows((prev) => {
				return prev.map((r) => {
					if (r.uid !== id) return r;
					return { ...r, ...orig, status: "existing" };
				});
			});
		}
	}

	return (
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
			<DataTable
				data={rows}
				columns={columns}
				pagination={props.pagination}
				sortable
				editable
				deleteable
				addable
			/>
		</div>
	);
}
