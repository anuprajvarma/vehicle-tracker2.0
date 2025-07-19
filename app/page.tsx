import Head from "next/head";
import LeafletMap from "./components/LeafletMap";

export default function Home() {
  return (
    <>
      <Head>
        <title>Leaflet Map</title>
      </Head>
      <LeafletMap />
    </>
  );
}
