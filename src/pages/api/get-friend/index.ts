import { getFriend } from "@/lib/firebase/services";
import { apiResponse } from "@/utils/apiResponse";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { friendId } = req.body;
  const response = await getFriend(friendId);
  return apiResponse(res, response, "berhasil mencari friend", response);
}
