import { updateLastChat } from "@/lib/firebase/services";
import { apiResponse } from "@/utils/apiResponse";
import { verifyToken } from "@/utils/verifyToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { roomId } = req.body;
    return verifyToken(req, res, async (decode) => {
      const response = await updateLastChat(roomId);
      return apiResponse(res, response, "lastChat berhasil di perbaharui");
    });
  }
}
