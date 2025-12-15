import {
	getDummyTransaction,
	Pagination,
	Transaction,
	transactionList,
} from "@/lib/data";
import { TransactionList } from "./transaction-list";
import { GetServerSideProps } from "next";

type PageProps = {
	items: Transaction[];
	pagination: Pagination;
};
export default function Home(props: PageProps) {
	console.log(props);

	return (
		<div className="p-24">
			<TransactionList data={props.items} pagination={props.pagination} />
			{/* <JsonView src={rows.filter((x) => x.status === "updated")} />
			<JsonView src={rows.filter((x) => x.status === "existing")} />
			<JsonView src={rows.filter((x) => x.status === "new")} /> */}
		</div>
	);
}
export const getServerSideProps: GetServerSideProps<PageProps> = async ({
	query,
	req,
}) => {
	const page = Number(query.page ?? 1);
	const limit = 5;
	try {
		const data = await Promise.resolve(getDummyTransaction({ page, limit }));

		return {
			props: {
				items: data.items,
				pagination: data.pagination,
			},
		};
	} catch (error) {
		console.error("SSR fetch error:", error);

		return {
			props: {
				items: [],
				pagination: {
					page: 1,
					limit,
					total: 0,
					totalPages: 1,
				},
			},
		};
	}
};
