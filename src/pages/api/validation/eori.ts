import { NextApiRequest, NextApiResponse } from "next";
const soap = require("strong-soap").soap;

const url =
  "https://ec.europa.eu/taxation_customs/dds2/eos/validation/services/validation?wsdl";

const eoriValidation = async (eori: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    soap.createClient(url, (err: any, client: any) => {
      if (err) {
        reject(err);
      }
      resolve(client);
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

    const client = await eoriValidation(body.eori as string);

    const args = {
      eori: body.eori as string,
    };

    client.validateEORI(args, (err: any, result: any) => {
      if (err) {
        return res.json({
          status: 500,
          message: err.message,
        });
      }

      const firstResult = (result as any).return.result[0];

      return res.json({
        status: 200,
        data: firstResult,
      });
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}
