import { NextApiRequest, NextApiResponse } from "next";
const soap = require("strong-soap").soap;

const url =
  "https://ec.europa.eu/taxation_customs/dds2/eos/validation/services/validation?wsdl";

const eoriValidation = async (eori: string) => {
  return new Promise((resolve, reject) => {
    soap.createClient(url, (err: any, client: any) => {
      if (err) {
        reject(err);
      }

      const args = {
        eori: eori,
      };

      client.validateEORI(args, (err: any, result: any) => {
        if (err) {
          reject(err);
        }

        resolve(result as any);
      });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.json({
      status: 405,
      message: "Method not allowed",
    });
  }

  try {
    const body = req.body;

    const result = await eoriValidation(body.eori as string);

    const firstResult = (result as any).return.result[0];

    return res.json({
      status: 200,
      data: firstResult,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
