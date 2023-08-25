import clientPromise from "./mongodb";

let client
let db
let dosya

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = await client.db()
        dosya = await db.collection("dosya")
    } catch (error) {
        throw new Error("Failed to stablish connection to database")
    }
}

; (async () => {
    await init()
})

export async function getDosyalar() {
    try {
        if (!dosya) await init()
        const result = await dosya
            .find({})
            .limit(3)
            .map(dsy => ({ ...dsy, _id: dsy._id.toString() }))
            .toArray();
        return { dosya: result }
    } catch (error) {
        return { error: "Failed to fetch dosya" }
    }
}

export async function getDosyaByTypeAndValue(__typename, value) {
    try {
        const result = await dosya
            .find(filterData(__typename, value))
            .toArray();
        return { dosya: result }
    } catch (error) {
        return { error: "Failed to fetch by type: " + __typename + " and fetch by value: " + value }
    }
}

const filterData = (type, value) => {
    if (type === "kimlikNumarasi") return { "kimlikNumarasi": value }
    else if (type === "pasaportNumarasi") return { "pasaportNumarasi": value }
    else if (type === "vkn") return { "vkn": value }
    else if (type === "evTel") return { "evTel": value }
    else if (type === "ilKodu") return { "ilKodu": value }
}