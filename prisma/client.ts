import { PrismaClient } from "@prisma/client";

const IdMap: { [key: string]: string } = {};
const prismaClientSingleton = () => {
  return new PrismaClient({
    errorFormat: "minimal",
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

prisma.$use(async (params: any, next: Function) => {
  // @ts-ignore
  if (params.action === "create" && IdMap[params.model]) {
    const model = params.model;
    // @ts-ignore
    const prefix = IdMap[model];
    // @ts-ignore
    const lastRecord = await prisma[String(model).toLowerCase()].findFirst({
      orderBy: { id: "desc" },
    });

    const newId = lastRecord ? lastRecord.id + 1 : 1;
    params.args.data.customId = `${prefix}${newId}`;
  }

  return next(params);
});

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
