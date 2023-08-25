import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic"
import _ from "lodash";
import clientPromise from "../lib/mongo/mongodb";

const NoSSRForceGraph = dynamic(() => import('../lib/force-graph/NoSSRForceGraph'), {
  ssr: false
});

export async function getStaticProps() {
  try {
    const client = await clientPromise;
    const db = await client.db()
    const dosyalar = await db
      .collection("dosya")
      .find({})
      .sort({ metacritic: -1 })
      .limit(3)
      .toArray();
    return {
      props: { dosyalar: JSON.parse(JSON.stringify(dosyalar)) },
    };
  } catch (e) {
    console.error(e);
  }
}

export default function Home({ dosyalar }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const isFetchDosya = useRef(false);

  useEffect(() => {
    if (!isFetchDosya.current) {
      console.log(dosyalar);
      setGraphData(formatData(dosyalar))
      isFetchDosya.current = true;
    }
  }, [isFetchDosya.current]);

  const formatData = (dosyalar) => {
    const nodes = [];
    const links = [];

    dosyalar.forEach(dosya => {
      nodes.push({
        id: dosya._id,
        __typename: "dosya"
      })
      nodes.push({
        id: dosya.kimlikNumarasi,
        __typename: "kimlikNumarasi"
      })
      nodes.push({
        id: dosya.pasaportNumarasi,
        __typename: "pasaportNumarasi"
      })
      nodes.push({
        id: dosya.vkn,
        __typename: "vkn"
      })
      nodes.push({
        id: dosya.evTel,
        __typename: "evTel"
      })
      nodes.push({
        id: dosya.ilKodu,
        __typename: "ilKodu"
      })
      links.push({
        source: dosya._id,
        target: dosya.kimlikNumarasi
      })
      links.push({
        source: dosya._id,
        target: dosya.pasaportNumarasi
      })
      links.push({
        source: dosya._id,
        target: dosya.vkn
      })
      links.push({
        source: dosya._id,
        target: dosya.ilKodu
      })
      links.push({
        source: dosya._id,
        target: dosya.evTel
      })
    });

    return {
      nodes: _.uniqBy(nodes, "id"),
      links,
    };
  }

  return (
    <NoSSRForceGraph
      nodeAutoColorBy={"__typename"}
      nodeLabel={"id"}
      graphData={graphData}
    />
  )
}
