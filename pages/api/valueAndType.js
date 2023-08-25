import { getDosyaByTypeAndValue } from "@/lib/mongo/dosyalar";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { id, __typename } = req.body;
            const { dosya, error } = await getDosyaByTypeAndValue(__typename, id);
            if (error) throw new Error(error)
            return res.status(200).json({ dosya })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['POST'])
    res.status(425).end(`Method ${req.method} is not allowed`)
}

export default handler;