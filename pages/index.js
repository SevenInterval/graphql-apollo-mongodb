import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic"
import _ from "lodash";
import Filter from "./components/Filter";

const NoSSRForceGraph = dynamic(() => import('../lib/force-graph/NoSSRForceGraph'), {
  ssr: false
});

export default function Home({ }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const isFetchDosya = useRef(false);

  useEffect(() => {
    if (!isFetchDosya.current) {
      fetch('/api/dosya')
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          data.dosya ? setGraphData(formatData(data.dosya)) : null;
        })
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

  const loadMoreData = (id, __typename) => {
    fetch('/api/valueAndType', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, __typename })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.dosya) {
          const newSubgraph = formatData(data.dosya);
          setGraphData({
            nodes: _.uniqBy([...graphData.nodes, ...newSubgraph.nodes], "id"),
            links: [...graphData.links, ...newSubgraph.links]
          })
        }
      })
  }

  const handleSubmit = (typename, id) => {
    loadMoreData(id, typename);
  }

  const handleTemizleSubmit = () => {
    setGraphData({ nodes: [], links: [] })
  }

  return (
    <div>
      <div>
        <Filter handleSubmit={handleSubmit} handleTemizleSubmit={handleTemizleSubmit} />
      </div>
      <div style={{ margin: "3%", border: "2px solid gray", borderRadius: "50px", background: "white", height: "600px" }}>
        <NoSSRForceGraph
          nodeAutoColorBy={"__typename"}
          nodeLabel={"id"}
          graphData={graphData}
          onNodeClick={(node, event) => {
            if (node.__typename !== "dosya") {
              loadMoreData(node.id, node.__typename)
            }
          }}
        />
      </div>
    </div>
  )
}
