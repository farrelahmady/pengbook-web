import { getDummyTransaction, Pagination, Transaction } from "@/lib/data";
import { TransactionList } from "./transaction-list";

type PageProps = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
	const params = await searchParams;

	const page = Number(params?.page ?? 1);
	const limit = 5;

	let items: Transaction[] = [];
	let pagination: Pagination;

	try {
		const data = await getDummyTransaction({ page, limit });

		items = data.items;
		pagination = data.pagination;
	} catch (error) {
		console.error("SSR fetch error:", error);

		pagination = {
			page: 1,
			limit,
			total: 0,
			totalPages: 1,
		};
	}

	return (
		<div className="p-24">
			<TransactionList data={items} pagination={pagination} />
		</div>
	);
}
