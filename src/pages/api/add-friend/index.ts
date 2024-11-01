import { addFriend } from "@/lib/firebase/services";
import { apiResponse } from "@/utils/apiResponse";
import { verifyToken } from "@/utils/verifyToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    return verifyToken(req, res, async () => {
      const response = await addFriend(data);
      return apiResponse(res, response, "success add friend");
    });
  }
}
