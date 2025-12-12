import React from "react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

// Full version: TanStack Table + Resize + Overflow + Sticky Header + Sticky First Column
// TailwindCSS required

type Props<T> = {
	data: T[];
	columns: ColumnDef<T>[];
};

export default function ResizableTable<T>({ data, columns }: Props<T>) {
	const table = useReactTable({
		data,
		columns,
		enableColumnResizing: true,
		columnResizeMode: "onChange",
		getCoreRowModel: getCoreRowModel(),
		state: {
			columnSizing: {},
		},
	});

	return (
		<div className="w-full overflow-x-auto border rounded-lg">
			<table className="w-max border-collapse text-sm">
				<thead className="bg-gray-100 sticky top-0 z-20 shadow">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header, i) => (
								<th
									key={header.id}
									style={{ width: header.getSize() }}
									className={
										"relative border-y border-r bg-gray-100 px-3 py-2 font-semibold " +
										(i === 0 ? "sticky left-0 z-30 bg-gray-100 shadow" : "")
									}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}

									{/* Resize Handle */}
									<div
										onMouseDown={header.getResizeHandler()}
										onTouchStart={header.getResizeHandler()}
										className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none"
									/>
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className="hover:bg-gray-50">
							{row.getVisibleCells().map((cell, i) => (
								<td
									key={cell.id}
									style={{ width: cell.column.getSize() }}
									className={
										"border-r border-b px-3 py-2 " +
										(i === 0 ? "sticky left-0 z-10 bg-white shadow" : "")
									}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

// Example usage:
// const columns: ColumnDef<User>[] = [
//   { accessorKey: "name", header: "Name", size: 200, minSize: 120 },
//   { accessorKey: "email", header: "Email", size: 250 },
//   { accessorKey: "role", header: "Role", size: 150 },
// ];
//
// <ResizableTable data={users} columns={columns} />
