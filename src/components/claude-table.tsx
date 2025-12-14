import React, { useState, useMemo } from "react";
import {
	Pencil,
	Trash2,
	Check,
	X,
	Plus,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const TransactionTable = () => {
	// Sample account options
	const accountOptions = [
		{ value: "cash", label: "Cash" },
		{ value: "bank", label: "Bank" },
		{ value: "sales", label: "Sales" },
		{ value: "expense", label: "Expense" },
		{ value: "revenue", label: "Revenue" },
		{ value: "inventory", label: "Inventory" },
		{ value: "accounts-receivable", label: "Accounts Receivable" },
		{ value: "accounts-payable", label: "Accounts Payable" },
	];

	const [transactions, setTransactions] = useState([
		{
			id: 1,
			date: "2024-12-01",
			from: "cash",
			to: "sales",
			amount: 1500000,
			notes: "Pembayaran invoice",
		},
		{
			id: 2,
			date: "2024-12-02",
			from: "bank",
			to: "revenue",
			amount: 2500000,
			notes: "Transfer bulanan",
		},
		{
			id: 3,
			date: "2024-12-03",
			from: "sales",
			to: "cash",
			amount: 500000,
			notes: "Pengembalian",
		},
		{
			id: 4,
			date: "2024-12-04",
			from: "expense",
			to: "bank",
			amount: 3200000,
			notes: "Pembayaran produk",
		},
		{
			id: 5,
			date: "2024-12-05",
			from: "inventory",
			to: "accounts-payable",
			amount: 1800000,
			notes: "Pembelian stok",
		},
	]);

	const [editingId, setEditingId] = useState(null);
	const [editData, setEditData] = useState({});
	const [selectedIds, setSelectedIds] = useState([]);
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newData, setNewData] = useState({
		date: "",
		from: "",
		to: "",
		amount: "",
		notes: "",
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
	const [filters, setFilters] = useState({
		from: "",
		to: "",
		minAmount: "",
		maxAmount: "",
	});

	// Filter data
	const filteredData = useMemo(() => {
		return transactions.filter((item) => {
			const matchFrom = !filters.from || item.from === filters.from;
			const matchTo = !filters.to || item.to === filters.to;
			const matchMinAmount =
				!filters.minAmount || item.amount >= Number(filters.minAmount);
			const matchMaxAmount =
				!filters.maxAmount || item.amount <= Number(filters.maxAmount);
			return matchFrom && matchTo && matchMinAmount && matchMaxAmount;
		});
	}, [transactions, filters]);

	// Sort data
	const sortedData = useMemo(() => {
		if (!sortConfig.key) return filteredData;

		return [...filteredData].sort((a, b) => {
			if (a[sortConfig.key] < b[sortConfig.key]) {
				return sortConfig.direction === "asc" ? -1 : 1;
			}
			if (a[sortConfig.key] > b[sortConfig.key]) {
				return sortConfig.direction === "asc" ? 1 : -1;
			}
			return 0;
		});
	}, [filteredData, sortConfig]);

	// Paginate data
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return sortedData.slice(startIndex, startIndex + itemsPerPage);
	}, [sortedData, currentPage, itemsPerPage]);

	// Calculate summary
	const summary = useMemo(() => {
		return {
			totalAmount: filteredData.reduce((sum, item) => sum + item.amount, 0),
			count: filteredData.length,
			avgAmount:
				filteredData.length > 0
					? filteredData.reduce((sum, item) => sum + item.amount, 0) /
					  filteredData.length
					: 0,
		};
	}, [filteredData]);

	const totalPages = Math.ceil(sortedData.length / itemsPerPage);

	const handleSort = (key) => {
		setSortConfig((prev) => ({
			key,
			direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
		}));
	};

	const handleEdit = (item) => {
		setEditingId(item.id);
		setEditData({ ...item });
	};

	const handleSave = () => {
		setTransactions((prev) =>
			prev.map((item) =>
				item.id === editingId
					? { ...editData, amount: Number(editData.amount) }
					: item
			)
		);
		setEditingId(null);
		setEditData({});
	};

	const handleCancel = () => {
		setEditingId(null);
		setEditData({});
	};

	const handleAddNew = () => {
		if (newData.date && newData.from && newData.to && newData.amount) {
			const newTransaction = {
				id: Math.max(...transactions.map((t) => t.id), 0) + 1,
				...newData,
				amount: Number(newData.amount),
			};
			setTransactions((prev) => [...prev, newTransaction]);
			setNewData({ date: "", from: "", to: "", amount: "", notes: "" });
			setIsAddingNew(false);
		}
	};

	const handleDeleteMany = () => {
		setTransactions((prev) =>
			prev.filter((item) => !selectedIds.includes(item.id))
		);
		setSelectedIds([]);
	};

	const toggleSelectAll = () => {
		if (selectedIds.length === paginatedData.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(paginatedData.map((item) => item.id));
		}
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(amount);
	};

	const getAccountLabel = (value) => {
		return accountOptions.find((opt) => opt.value === value)?.label || value;
	};

	const SortIcon = ({ column }) => {
		if (sortConfig.key !== column)
			return <ChevronDown className="w-4 h-4 opacity-30" />;
		return sortConfig.direction === "asc" ? (
			<ChevronUp className="w-4 h-4" />
		) : (
			<ChevronDown className="w-4 h-4" />
		);
	};

	return (
		<div className="w-full max-w-7xl mx-auto p-6 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Transaksi</h1>
				<div className="flex gap-2">
					{selectedIds.length > 0 && (
						<Button onClick={handleDeleteMany} variant="destructive" size="sm">
							<Trash2 className="w-4 h-4 mr-2" />
							Hapus ({selectedIds.length})
						</Button>
					)}
					<Button onClick={() => setIsAddingNew(true)} size="sm">
						<Plus className="w-4 h-4 mr-2" />
						Tambah Baru
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
				<div>
					<label className="text-sm font-medium mb-1 block">Filter From</label>
					<Select
						value={filters.from}
						onValueChange={(value) =>
							setFilters((prev) => ({ ...prev, from: value }))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Semua" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value=" ">Semua</SelectItem>
							{accountOptions.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<label className="text-sm font-medium mb-1 block">Filter To</label>
					<Select
						value={filters.to}
						onValueChange={(value) =>
							setFilters((prev) => ({ ...prev, to: value }))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Semua" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value=" ">Semua</SelectItem>
							{accountOptions.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<label className="text-sm font-medium mb-1 block">Min Amount</label>
					<Input
						type="number"
						placeholder="Min Amount"
						value={filters.minAmount}
						onChange={(e) =>
							setFilters((prev) => ({ ...prev, minAmount: e.target.value }))
						}
					/>
				</div>
				<div>
					<label className="text-sm font-medium mb-1 block">Max Amount</label>
					<Input
						type="number"
						placeholder="Max Amount"
						value={filters.maxAmount}
						onChange={(e) =>
							setFilters((prev) => ({ ...prev, maxAmount: e.target.value }))
						}
					/>
				</div>
			</div>

			{/* Summary */}
			<div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
				<div>
					<p className="text-sm text-gray-600">Total Transaksi</p>
					<p className="text-xl font-bold">{summary.count}</p>
				</div>
				<div>
					<p className="text-sm text-gray-600">Total Amount</p>
					<p className="text-xl font-bold">
						{formatCurrency(summary.totalAmount)}
					</p>
				</div>
				<div>
					<p className="text-sm text-gray-600">Rata-rata Amount</p>
					<p className="text-xl font-bold">
						{formatCurrency(summary.avgAmount)}
					</p>
				</div>
			</div>

			{/* Table with Horizontal Scroll */}
			<div className="border rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full min-w-max">
						<thead className="bg-gray-100">
							<tr>
								<th className="p-3 text-left" style={{ minWidth: "50px" }}>
									<Checkbox
										checked={
											selectedIds.length === paginatedData.length &&
											paginatedData.length > 0
										}
										onCheckedChange={toggleSelectAll}
									/>
								</th>
								<th
									className="p-3 text-left cursor-pointer hover:bg-gray-200"
									onClick={() => handleSort("date")}
									style={{ minWidth: "150px" }}
								>
									<div className="flex items-center gap-2">
										Date <SortIcon column="date" />
									</div>
								</th>
								<th
									className="p-3 text-left cursor-pointer hover:bg-gray-200"
									onClick={() => handleSort("from")}
									style={{ minWidth: "200px" }}
								>
									<div className="flex items-center gap-2">
										From <SortIcon column="from" />
									</div>
								</th>
								<th
									className="p-3 text-left cursor-pointer hover:bg-gray-200"
									onClick={() => handleSort("to")}
									style={{ minWidth: "200px" }}
								>
									<div className="flex items-center gap-2">
										To <SortIcon column="to" />
									</div>
								</th>
								<th
									className="p-3 text-left cursor-pointer hover:bg-gray-200"
									onClick={() => handleSort("amount")}
									style={{ minWidth: "180px" }}
								>
									<div className="flex items-center gap-2">
										Amount <SortIcon column="amount" />
									</div>
								</th>
								<th className="p-3 text-left" style={{ minWidth: "250px" }}>
									Notes
								</th>
								<th
									className="p-3 text-left sticky right-0 bg-gray-100 shadow-[-4px_0_8px_rgba(0,0,0,0.08)]"
									style={{ minWidth: "120px" }}
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{isAddingNew && (
								<tr className="border-b bg-green-50">
									<td className="p-3"></td>
									<td className="p-3">
										<Input
											type="date"
											value={newData.date}
											onChange={(e) =>
												setNewData((prev) => ({
													...prev,
													date: e.target.value,
												}))
											}
											className="w-full"
										/>
									</td>
									<td className="p-3">
										<Select
											value={newData.from}
											onValueChange={(value) =>
												setNewData((prev) => ({ ...prev, from: value }))
											}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Pilih From" />
											</SelectTrigger>
											<SelectContent>
												{accountOptions.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</td>
									<td className="p-3">
										<Select
											value={newData.to}
											onValueChange={(value) =>
												setNewData((prev) => ({ ...prev, to: value }))
											}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Pilih To" />
											</SelectTrigger>
											<SelectContent>
												{accountOptions.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</td>
									<td className="p-3">
										<Input
											type="number"
											value={newData.amount}
											onChange={(e) =>
												setNewData((prev) => ({
													...prev,
													amount: e.target.value,
												}))
											}
											placeholder="Amount"
											className="w-full"
										/>
									</td>
									<td className="p-3">
										<Textarea
											value={newData.notes}
											onChange={(e) =>
												setNewData((prev) => ({
													...prev,
													notes: e.target.value,
												}))
											}
											placeholder="Notes"
											className="w-full min-h-[60px]"
										/>
									</td>
									<td className="p-3 sticky right-0 bg-green-50 shadow-[-4px_0_8px_rgba(0,0,0,0.08)]">
										<div className="flex gap-1">
											<Button size="sm" onClick={handleAddNew} variant="ghost">
												<Check className="w-4 h-4" />
											</Button>
											<Button
												size="sm"
												onClick={() => setIsAddingNew(false)}
												variant="ghost"
											>
												<X className="w-4 h-4" />
											</Button>
										</div>
									</td>
								</tr>
							)}
							{paginatedData.map((item) => (
								<tr key={item.id} className="border-b hover:bg-gray-50">
									<td className="p-3">
										<Checkbox
											checked={selectedIds.includes(item.id)}
											onCheckedChange={(checked) => {
												if (checked) {
													setSelectedIds((prev) => [...prev, item.id]);
												} else {
													setSelectedIds((prev) =>
														prev.filter((id) => id !== item.id)
													);
												}
											}}
										/>
									</td>
									{editingId === item.id ? (
										<>
											<td className="p-3">
												<Input
													type="date"
													value={editData.date}
													onChange={(e) =>
														setEditData((prev) => ({
															...prev,
															date: e.target.value,
														}))
													}
													className="w-full"
												/>
											</td>
											<td className="p-3">
												<Select
													value={editData.from}
													onValueChange={(value) =>
														setEditData((prev) => ({ ...prev, from: value }))
													}
												>
													<SelectTrigger className="w-full">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{accountOptions.map((opt) => (
															<SelectItem key={opt.value} value={opt.value}>
																{opt.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</td>
											<td className="p-3">
												<Select
													value={editData.to}
													onValueChange={(value) =>
														setEditData((prev) => ({ ...prev, to: value }))
													}
												>
													<SelectTrigger className="w-full">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{accountOptions.map((opt) => (
															<SelectItem key={opt.value} value={opt.value}>
																{opt.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</td>
											<td className="p-3">
												<Input
													type="number"
													value={editData.amount}
													onChange={(e) =>
														setEditData((prev) => ({
															...prev,
															amount: e.target.value,
														}))
													}
													className="w-full"
												/>
											</td>
											<td className="p-3">
												<Textarea
													value={editData.notes}
													onChange={(e) =>
														setEditData((prev) => ({
															...prev,
															notes: e.target.value,
														}))
													}
													className="w-full min-h-[60px]"
												/>
											</td>
											<td className="p-3 sticky right-0 bg-white shadow-[-4px_0_8px_rgba(0,0,0,0.08)]">
												<div className="flex gap-1">
													<Button
														size="sm"
														onClick={handleSave}
														variant="ghost"
													>
														<Check className="w-4 h-4" />
													</Button>
													<Button
														size="sm"
														onClick={handleCancel}
														variant="ghost"
													>
														<X className="w-4 h-4" />
													</Button>
												</div>
											</td>
										</>
									) : (
										<>
											<td className="p-3">{item.date}</td>
											<td className="p-3">{getAccountLabel(item.from)}</td>
											<td className="p-3">{getAccountLabel(item.to)}</td>
											<td className="p-3 font-semibold">
												{formatCurrency(item.amount)}
											</td>
											<td className="p-3 text-gray-600">{item.notes}</td>
											<td className="p-3 sticky right-0 bg-white shadow-[-4px_0_8px_rgba(0,0,0,0.08)]">
												<Button
													size="sm"
													onClick={() => handleEdit(item)}
													variant="ghost"
												>
													<Pencil className="w-4 h-4" />
												</Button>
											</td>
										</>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-600">Rows per page:</span>
					<Select
						value={String(itemsPerPage)}
						onValueChange={(value) => {
							setItemsPerPage(Number(value));
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="w-20">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="5">5</SelectItem>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="50">50</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-600">
						Page {currentPage} of {totalPages}
					</span>
					<Button
						size="sm"
						onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<Button
						size="sm"
						onClick={() =>
							setCurrentPage((prev) => Math.min(totalPages, prev + 1))
						}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TransactionTable;
