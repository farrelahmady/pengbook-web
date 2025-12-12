import { transactionList } from "@/lib/data";
import { TransactionList } from "./transaction-list";
import { DataTableDemo } from "./datatable";

export default function Home() {
	return (
		<div className="p-24">
			<TransactionList data={transactionList} />
			<DataTableDemo />
			{/* <JsonView src={rows.filter((x) => x.status === "updated")} />
			<JsonView src={rows.filter((x) => x.status === "existing")} />
			<JsonView src={rows.filter((x) => x.status === "new")} /> */}
		</div>
	);
}
