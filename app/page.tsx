"use client";

import dynamic from "next/dynamic";

const LeafletMapClient = dynamic(() => import("./components/LeafletMap"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <LeafletMapClient />
    </>
  );
}
