"use client";

import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), {
	ssr: false,
});

export function JsonView({ src }: { src: any }) {
	return <ReactJson src={src} collapsed={false} />;
}
