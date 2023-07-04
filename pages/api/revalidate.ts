import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

const cors = Cors({
  origin: false,
  methods: ["GET"],
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  runMiddleware(req, res, cors);
  let revalidated = false;
  try {
    await res.revalidate("/");
    revalidated = true;
  } catch (err) {
    console.log(err);
  }

  res.json({
    revalidated,
  });
}
