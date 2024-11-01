import { declineFriend } from "@/lib/firebase/services";
import { apiResponse } from "@/utils/apiResponse";
import { verifyToken } from "@/utils/verifyToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler( req: NextApiRequest,res: NextApiResponse) {
  if (req.method === "DELETE") {
    const id = req.query.id;
    return verifyToken(req, res, async () => {
          const response = await declineFriend(id as string)
          return apiResponse(res, response, "success add friend");
    });
  }
}
