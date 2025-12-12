"use client";
import { ComboBox } from "@/components/combo-box";
import { CurrencyInput } from "@/components/currency-input";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { masterChartOfAccounts, Transaction } from "@/lib/data";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { cn, iconSetting } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import React, { useEffect } from "react";

export type TransactionListProps = {
	data: Transaction[];
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
	const columns: ColumnDef<Transaction>[] = [
		{
			accessorKey: "date",
			header: "Date",
			cell: ({ row }) => {
				const item = row.original;
				return (
					<DatePicker
						value={item.date}
						onChange={(value) => updateRow(item.key, { date: value })}
					/>
				);
			},
			enableResizing: true,
			minSize: 100,
		},
		{
			accessorKey: "from",
			header: "From",
			cell: ({ row }) => {
				const item = row.original;
				return (
					<ComboBox
						data={masterChartOfAccounts}
						value={item.from}
						onChange={(value) => updateRow(item.key, { from: value })}
					/>
				);
			},
			enableResizing: true,
			size: 100,
			minSize: 200,
		},
		{
			accessorKey: "to",
			header: "To",
			cell: ({ row }) => {
				const item = row.original;
				return (
					<ComboBox
						data={masterChartOfAccounts}
						value={item.to}
						onChange={(value) => updateRow(item.key, { to: value })}
					/>
				);
			},
			enableResizing: true,
			size: 100,
			minSize: 200,
		},
		{
			accessorKey: "amount",
			header: "Amount",
			cell: ({ row }) => {
				const item = row.original;
				return (
					<CurrencyInput
						value={item.amount}
						onChange={(value) => updateRow(item.key, { amount: value })}
					/>
				);
			},
			enableResizing: true,
			size: 100,
			minSize: 200,
		},
		{
			accessorKey: "note",
			header: "Note",
			cell: ({ row }) => {
				const item = row.original;
				return (
					<Textarea
						value={item.note || ""}
						onChange={(e) => updateRow(item.key, { note: e.target.value })}
					/>
				);
			},
			enableResizing: true,
			size: 100,
			minSize: 400,
		},
		{
			id: "actions",
			header: () => <div className="text-center">Action</div>,
			meta: { sticky: true },
			cell: ({ row }) => {
				const item = row.original;

				return (
					<div className="flex gap-1 justify-center w-full">
						{item.status === "new" && (
							<>
								<Button size={"icon-sm"} variant={"primary"}>
									<SaveIcon sx={iconSetting} />
								</Button>
								<Button
									size={"icon-sm"}
									variant={"destructive"}
									onClick={() => cancelAddRow(item.key)}
								>
									<CancelIcon sx={iconSetting} />
								</Button>
							</>
						)}
						{item.status === "updated" && (
							<>
								<Button size={"icon-sm"} variant={"primary"}>
									<SaveIcon sx={iconSetting} />
								</Button>
								<Button
									size={"icon-sm"}
									variant={"destructive"}
									onClick={() => cancelUpdateRow(item.key)}
								>
									<CancelIcon sx={iconSetting} />
								</Button>
							</>
						)}
						{item.status === "existing" && (
							<Button size={"icon-sm"} variant={"destructive"}>
								<DeleteIcon sx={iconSetting} />
							</Button>
						)}
					</div>
				);
			},
			enableResizing: true,
			size: 50,
		},
	];

	return columns;
}

export function TransactionList(props: TransactionListProps) {
	const [rows, setRows] = React.useState(props.data);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	useEffect(() => {
		setRows(props.data);
	}, [props.data]);

	const columns = getColumns({
		updateRow: updateRow,
		cancelAddRow: cancelAddRow,
		cancelUpdateRow: cancelUpdateRow,
	});

	const table = useReactTable({
		data: rows,
		columns: columns,
		columnResizeMode: "onChange",
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
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
		const orig = props.data.find((r) => r.key === id);
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
				<div className="overflow-hidden rounded-md border">
					<div className="overflow-x-auto w-full">
						<Table className="min-w-max table-auto">
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											const meta = (header.column.columnDef.meta ?? {}) as any;

											return (
												<TableHead
													onMouseDown={header.getResizeHandler()}
													key={header.id}
													style={{
														width: header.getSize() ?? "auto",
														position: meta.sticky ? "sticky" : "relative",
														right: meta.sticky ? 0 : undefined,
														zIndex: meta.sticky ? 5 : undefined,
														background: "var(--background)",
													}}
												>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext()
														  )}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
										>
											{row.getVisibleCells().map((cell) => {
												const meta = (cell.column.columnDef.meta ?? {}) as any;

												return (
													<TableCell
														key={cell.id}
														style={{
															width: cell.column.getSize(),
															position: meta.sticky ? "sticky" : "relative",
															right: meta.sticky ? 0 : undefined,
															zIndex: meta.sticky ? 5 : undefined,
															background: meta.sticky
																? "var(--background)"
																: undefined,
															boxShadow: meta.sticky
																? "-4px 0 8px rgba(0, 0, 0, 0.08)"
																: undefined,
															backdropFilter: meta.sticky
																? "blur(2px)"
																: undefined,
														}}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												);
											})}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="text-muted-foreground flex-1 text-sm">
						{table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="space-x-2">
						<Button
							variant="primary"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant="primary"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
