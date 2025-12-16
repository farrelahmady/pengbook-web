"use client";
import { Button } from "@/components/ui/button";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	OnChangeFn,
	PaginationState,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import React, { useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { convertToRupiah, iconSetting } from "@/lib/utils";
import moment from "moment";
import { DatePicker } from "./date-picker";
import { ComboBox } from "./combo-box";
import { Input } from "./ui/input";
import { CurrencyInput } from "./currency-input";
import { Textarea } from "./ui/textarea";
import { Pagination } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
export type DataTableProps<T> = {
	title?: string | React.Component;
	data: T[];
	columns: ColumnConfig<T>[];
	queryKeyBase: unknown[];
	queryFn: (params: { page: number; limit: number }) => Promise<{
		items: T[];
	}>;
	pageCount?: number;
	addable?: boolean;
	editable?: boolean;
	deleteable?: boolean;
	sortable?: boolean;
	filterable?: boolean;
	onSave?: (data: { add: T[]; update: T[] }) => Promise<void>;
	onDelete?: (data: { delete: T[] }) => Promise<void>;
};

export type ColumnConfig<T> = {
	key: keyof T;
	label: string;
	sticky?: "left" | "right";
	inputType?: InputType;
	dataSource?: () => Promise<{ value: string; label: string }[] | string[]>;
	editable?: boolean;
	sortable?: boolean;
	filterable?: boolean;
	size?: number;
	minSize?: number;
	maxSize?: number;
};

export type InputType =
	| "text"
	| "currency"
	| "number"
	| "date"
	| "combo-box"
	| "textarea";

export type InputValueMap = {
	text: string;
	textarea: string;
	number: number | null;
	currency: number | null;
	date: Date | null;
	"combo-box": string | null;
};

export function DataTable<T extends { uid: string }>(props: DataTableProps<T>) {
	const [rows, setRows] = React.useState(props.data);
	const [editingId, setEditingId] = React.useState<string | null>(null);
	const [draftRow, setDraftRow] = React.useState<T | null>(null);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 5,
	});
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const { data } = useQuery({
		queryKey: [...props.queryKeyBase, props.data, pagination, sorting],
		queryFn: () => {
			return props.queryFn({
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize,
			});
		},
		initialData: { items: props.data },
		placeholderData: (previousData) => previousData,
		retryOnMount: false,
		refetchOnMount: false,
	});

	useEffect(() => {
		if (data?.items) {
			setRows(data.items);
		}
	}, [data]);

	const columns: ColumnDef<T>[] = props.columns.map((c) => {
		const isSortable = c.sortable ?? props.sortable ?? false;
		const isEditable = c.editable ?? props.editable ?? false;
		return {
			accessorKey: c.key,
			header: ({ column }) => {
				return (
					<>
						<div className="flex items-center gap-2">
							<span>{c.label}</span>
							{isSortable && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										console.log("Sort Click", column.getIsSorted());

										column.toggleSorting(column.getIsSorted() === "asc");
									}}
								>
									{column.getIsSorted() === "asc" ? (
										<KeyboardArrowUpIcon />
									) : (
										<KeyboardArrowDownIcon />
									)}
								</Button>
							)}
						</div>
					</>
				);
			},
			cell: ({ row }) => {
				const item = row.original as T;
				const rawValue =
					item.uid === editingId && draftRow ? draftRow[c.key] : item[c.key];

				if (isEditable && item.uid === editingId) {
					return (
						<EditableContent
							inputType={c.inputType ?? "text"}
							value={rawValue as any}
							onChange={(v) => updateDraftValue(c.key, v as any)}
							dataSource={c.dataSource}
						/>
					);
				}

				return (
					<CellContent inputType={c.inputType ?? "text"} value={rawValue} />
				);
			},
			enableSorting: isSortable,
			enableResizing: true,
			minSize: c.minSize,
			maxSize: c.maxSize,
			size: c.size,
		};
	});

	const table = useReactTable({
		data: rows,
		columns,

		manualPagination: true,
		manualSorting: true,

		pageCount: props.pageCount,

		state: {
			pagination: pagination,
			sorting: sorting,
		},

		onPaginationChange: setPagination,
		onSortingChange: setSorting,

		getCoreRowModel: getCoreRowModel(),
	});

	function updateCellValue<K extends keyof T>(
		rowIndex: number,
		key: K,
		value: T[K]
	) {
		setRows((prev) =>
			prev.map((row, idx) =>
				idx === rowIndex ? { ...row, [key]: value } : row
			)
		);
	}

	function updateDraftValue<K extends keyof T>(key: K, value: T[K]) {
		setDraftRow((prev) => (prev ? { ...prev, [key]: value } : prev));
	}

	return (
		<div className="w-full flex flex-col">
			<div className="border rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<Table className="w-full min-w-max">
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const meta = (header.column.columnDef.meta ?? {}) as any;

										return (
											<TableHead
												onMouseDown={() => {
													header.column.toggleSorting(
														header.column.getIsSorted() === "asc"
													);
												}}
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
									{props.editable && (
										<TableHead
											style={{ width: 50, position: "sticky", right: 0 }}
										>
											Action
										</TableHead>
									)}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => {
									const item = row.original as T;
									return (
										<TableRow
											key={item.uid}
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
											{props.editable && (
												<TableCell
													style={{
														width: 50,
														position: "sticky",
														right: 0,
														boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.08)",
														backdropFilter: "blur(1px)",
														textAlign: "center",
													}}
												>
													{item.uid === editingId ? (
														<>
															<Button
																variant="ghost"
																size="icon-sm"
																onClick={() => {
																	if (!draftRow) return;

																	setRows((prev) =>
																		prev.map((row) =>
																			row.uid === draftRow.uid ? draftRow : row
																		)
																	);

																	setEditingId(null);
																	setDraftRow(null);
																	props.onSave?.({
																		add: [],
																		update: [draftRow],
																	});
																}}
															>
																<CheckIcon sx={iconSetting} />
															</Button>
															<Button
																variant="ghost"
																size="icon-sm"
																onClick={() => {
																	setEditingId(null);
																	setDraftRow(null);
																}}
															>
																<ClearIcon sx={iconSetting} />
															</Button>
														</>
													) : (
														<Button
															variant="ghost"
															size="icon-sm"
															onClick={() => {
																setEditingId(item.uid);
																setDraftRow({ ...item }); // 🔑 snapshot
															}}
														>
															<EditIcon sx={iconSetting} />
														</Button>
													)}
												</TableCell>
											)}
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell
										colSpan={props.columns.length}
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
					{getPaginationRange(
						table.getState().pagination.pageIndex + 1,
						props.pageCount ?? 1,
						3
					).map((page) => (
						<Button
							key={page}
							variant={
								page === table.getState().pagination.pageIndex + 1
									? "primary"
									: "ghost"
							}
							size="sm"
							onClick={() => table.setPageIndex(page - 1)}
						>
							{page}
						</Button>
					))}
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
	);
}

type EditableContentProps<I extends InputType> = {
	inputType: I;
	value: InputValueMap[I];
	onChange: (value: InputValueMap[I]) => void;
	dataSource?: () => Promise<{ value: string; label: string }[] | string[]>;
};

function EditableContent<T extends InputType>(props: EditableContentProps<T>) {
	const { inputType, value, onChange, dataSource } = props;

	switch (inputType) {
		case "date":
			return (
				<DatePicker
					value={value as Date | null}
					onChange={(v) => onChange(v as InputValueMap[T])}
				/>
			);

		case "combo-box":
			return (
				<ComboBox
					data={dataSource ?? (() => Promise.resolve([]))}
					value={value as string | null}
					onChange={(v) => onChange(v as InputValueMap[T])}
				/>
			);

		case "currency":
			return (
				<CurrencyInput
					value={value as number | null}
					onCommit={(v) => onChange(v as InputValueMap[T])}
				/>
			);

		case "textarea":
			return (
				<Textarea
					defaultValue={value as string}
					onBlur={(e) => onChange(e.target.value as InputValueMap[T])}
				/>
			);

		case "text":
		default:
			return (
				<Input
					defaultValue={value as string}
					onBlur={(e) => onChange(e.target.value as InputValueMap[T])}
				/>
			);
	}
}

export type CellContentProps = {
	inputType: InputType;
	value: any;
};
function CellContent(props: CellContentProps) {
	let displayValue: string = "";

	if (props.value instanceof Date) {
		displayValue = moment(props.value).format("YYYY-MM-DD");
	} else if (typeof props.value === "number") {
		displayValue =
			props.inputType === "currency"
				? `Rp ${convertToRupiah(props.value)}`
				: props.value.toLocaleString();
	} else if (props.value != null) {
		displayValue = String(props.value);
	}

	return <>{displayValue}</>;
}

function getPaginationRange(
	currentPage: number,
	totalPages: number,
	visibleCount = 3
): number[] {
	const half = Math.floor(visibleCount / 2);

	let start = currentPage - half;
	let end = currentPage + half;

	// Jika di awal
	if (start < 1) {
		start = 1;
		end = visibleCount;
	}

	// Jika di akhir
	if (end > totalPages) {
		end = totalPages;
		start = totalPages - visibleCount + 1;
	}

	// Safety guard
	start = Math.max(start, 1);

	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
