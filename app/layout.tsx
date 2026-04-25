import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "Pengbook",
	description: "Aplikasi Pencatatan Keuangan",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: "#1a1a2e",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="id" suppressHydrationWarning>
			<body className="bg-secondary-50 antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
