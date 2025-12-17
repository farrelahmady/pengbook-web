// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Transaction, transactionList } from "@/lib/data";

/**
 * POST /api/transactions
 * Create new transactions (batch)
 */
export async function POST(req: NextRequest) {
	try {
		const body: Transaction[] = await req.json();

		// 🔹 VALIDASI
		if (!Array.isArray(body)) {
			return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
		}

		// 🔹 SIMULASI DB INSERT
		transactionList.unshift(...body);
		console.log("CREATE", transactionList);

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}

/**
 * PUT /api/transactions
 * Update transactions (batch)
 */
export async function PUT(req: NextRequest) {
	try {
		const body: Transaction[] = await req.json();

		if (!Array.isArray(body)) {
			return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
		}

		console.log("UPDATE", body);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}
