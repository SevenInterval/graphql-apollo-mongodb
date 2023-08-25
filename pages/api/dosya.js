import { getDosyalar } from "@/lib/mongo/dosyalar";

const handler = async (req, res) => {
    if (req.method === "GET") {
        try {
            const { dosya, error } = await getDosyalar()
            if (error) throw new Error(error)

            return res.status(200).json({ dosya })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['GET'])
    res.status(425).end(`Method ${req.method} is not allowed`)
}

export default handler;