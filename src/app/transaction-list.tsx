"use client";
import {
	getDummyTransaction,
	masterChartOfAccounts,
	Pagination,
	Transaction,
} from "@/lib/data";
import React, { useEffect } from "react";
import { ColumnConfig, QueryDataTable } from "@/components/datatable";

export type TransactionListProps = {
	data: Transaction[];
	pagination: Pagination;
};

export type TransactionColumns = {
	updateRow: (key: string, patch: Partial<Transaction>) => void;
	cancelAddRow: (key: string) => void;
	cancelUpdateRow: (key: string) => void;
};

export function getColumns() {
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
	];

	return columns;
}

export function TransactionList(props: TransactionListProps) {
	const [rows, setRows] = React.useState(props.data);

	useEffect(() => {
		setRows(props.data);
	}, [props.data]);

	const columns = getColumns();

	return (
		<QueryDataTable
			title={"Transaction"}
			initialItems={props.data}
			columns={columns}
			queryKeyBase={["transactions"]}
			queryFn={({ page, limit }) => {
				const data = getDummyTransaction({ page: page, limit: limit });
				console.log("Data", data);

				return Promise.resolve({
					items: data.items,
				});
			}}
			pageCount={props.pagination.totalPages}
			onSave={async (data) => {
				createTransactions(data.add);
			}}
			sortable
			editable
			deleteable
			addable
		/>
	);
}

export async function createTransactions(data: Transaction[]) {
	const res = await fetch("/api/dummy/transaction", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!res.ok) throw new Error("Failed to create transactions");
}

export async function updateTransactions(data: Transaction[]) {
	const res = await fetch("/api/transactions", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!res.ok) throw new Error("Failed to update transactions");
}
