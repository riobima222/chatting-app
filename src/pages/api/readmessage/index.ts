import { readMessage } from "@/lib/firebase/services";
import { apiResponse } from "@/utils/apiResponse";
import { verifyToken } from "@/utils/verifyToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { roomId, messages } = req.body;
    return verifyToken(req, res, async () => {
      const response = await readMessage(roomId, messages);
      return apiResponse(res, response, "pesan berhasil di baca");
    });
  }
}
