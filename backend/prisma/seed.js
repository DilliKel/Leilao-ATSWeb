const { PrismaClient } = require("@prisma/client");
const seedItems = require("../data.json");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.item.count();
  if (existing > 0) {
    console.log(`Banco já tem ${existing} itens, seed ignorado.`);
    return;
  }

  for (const item of seedItems) {
    await prisma.item.create({
      data: {
        nomeProd: item.nome_prod,
        descricao: item.descricao,
        image: item.image,
        valor: parseFloat(item.valor) || 0,
        time: item.time,
        sold: item.sold,
      },
    });
  }

  console.log(`${seedItems.length} itens inseridos a partir de data.json.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
