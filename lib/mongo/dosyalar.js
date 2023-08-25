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
            .limit(20)
            .map(dsy => ({ ...dsy, _id: dsy._id.toString() }))
            .toArray();
        return { dosya: result }
    } catch (error) {
        return { error: "Failed to fetch dosya" }
    }
}