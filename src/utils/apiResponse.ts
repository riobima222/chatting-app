import { NextApiResponse } from "next"

export const apiResponse = (res: NextApiResponse, response: boolean | any, message: string, data?: any) => {
    if(response) {
        return res.status(200).json({status: true, message, data})
    } else {
        return res.status(400).json({status: false, message: "koneksi firebase gagal", data})
    }
}