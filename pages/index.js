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
  const [highlightNodes, setHightLightNodes] = useState([])

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
    console.log(nodes);
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

  const nodeRender = (node, ctx, globalScale) => {
    if (highlightNodes.indexOf(node) !== -1) {
      // Add highlight ring around node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3 * 0.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#7d669e";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, 3, 0, 2 * Math.PI, false);

    switch (node.__typename) {
      case "kimlikNumarasi":
        ctx.fillStyle = "#016A70";
        break;
      case "pasaportNumarasi":
        ctx.fillStyle = "#27005D";
        break;
      case "vkn":
        ctx.fillStyle = "#FFA1F5";
        break;
      case "evTel":
        ctx.fillStyle = "#94A684";
        break;
      case "ilKodu":
        ctx.fillStyle = "#E1D263";
        break;
      default:
        ctx.fillStyle = "#ea5400";
        break;
    }

    ctx.fill();

    if (node.__typename === "dosya") {
      ctx.fillStyle = "#ea5400";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.fillText(`Dosya ${node.id}`, node.x, node.y + 10);
    }

    if (node.__typename === "kimlikNumarasi") {
      ctx.fillStyle = "#016A70";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.fillText(`Kimlik No ${node.id}`, node.x, node.y + 10);
    }

    if (node.__typename === "pasaportNumarasi") {
      ctx.fillStyle = "#27005D";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.fillText(`Pasaport No ${node.id}`, node.x, node.y + 10);
    }

    if (node.__typename === "vkn") {
      ctx.fillStyle = "#FFA1F5";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.fillText(`Vkn ${node.id}`, node.x, node.y + 10);
    }

    if (node.__typename === "evTel") {
      ctx.fillStyle = "#94A684";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.fillText(`Ev Tel ${node.id}`, node.x, node.y + 10);
    }

    if (node.__typename === "ilKodu") {
      ctx.fillStyle = "#E1D263";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.fillText(`İl Kodu ${node.id}`, node.x, node.y + 10);
    }
  }

  return (
    <div>
      <div>
        <Filter handleSubmit={handleSubmit} handleTemizleSubmit={handleTemizleSubmit} />
      </div>
      <div style={{ margin: "3%", border: "2px solid gray", borderRadius: "50px", background: "white", height: "600px" }}>
        <NoSSRForceGraph
          nodeLabel={"id"}
          graphData={graphData}
          onNodeClick={(node, event) => {
            if (node.__typename !== "dosya") {
              loadMoreData(node.id, node.__typename)
            }
          }}
          nodeCanvasObject={(node, canvasContext, scale) =>
            nodeRender(node, canvasContext, scale)
          }
        />
      </div>
    </div>
  )
}
