const prisma = require("./prisma");

const BID_INCREMENT = 0.01;
const BID_TIME_RESET = 60;
const NEW_ITEM_TIME = 60;

function toClientItem(item) {
  return {
    id: item.id,
    nome_prod: item.nomeProd,
    descricao: item.descricao,
    image: item.image,
    valor: item.valor,
    time: item.time,
    sold: item.sold,
    startAt: item.startAt.toISOString(),
    bidders: item.bids.map((bid) => bid.user.name),
  };
}

const withBids = {
  bids: {
    include: { user: true },
    orderBy: { createdAt: "asc" },
  },
};

async function getItems() {
  const items = await prisma.item.findMany({
    where: {
      sold: false,
      time: { gt: 0 },
      startAt: { lte: new Date() },
    },
    include: withBids,
  });

  return items.map(toClientItem);
}

async function getSoldItems() {
  const items = await prisma.item.findMany({
    where: { sold: true },
    include: withBids,
  });

  return items.map(toClientItem);
}

// Roda a cada tick do relógio do leilão: avança o tempo restante e marca como vendido quem chegou a zero.
async function tick() {
  await prisma.item.updateMany({
    where: { sold: false, time: { gt: 0 } },
    data: { time: { decrement: 1 } },
  });

  await prisma.item.updateMany({
    where: { sold: false, time: { lte: 0 } },
    data: { sold: true },
  });
}

async function placeBid({ itemId, userName }) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || item.sold || item.time <= 0) {
    return null;
  }

  const user = await prisma.user.upsert({
    where: { name: userName },
    update: {},
    create: { name: userName },
  });

  const novoValor = Math.round((item.valor + BID_INCREMENT) * 100) / 100;

  await prisma.$transaction([
    prisma.bid.create({
      data: { itemId: item.id, userId: user.id, valor: novoValor },
    }),
    prisma.item.update({
      where: { id: item.id },
      data: { valor: novoValor, time: BID_TIME_RESET },
    }),
  ]);

  return true;
}

async function getItemHistory(itemId) {
  const bids = await prisma.bid.findMany({
    where: { itemId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return bids.map((bid) => ({
    userName: bid.user.name,
    valor: bid.valor,
    createdAt: bid.createdAt.toISOString(),
  }));
}

async function addItem({ nomeProd, descricao, image, startAt }) {
  const item = await prisma.item.create({
    data: {
      nomeProd,
      descricao,
      image,
      startAt: startAt ? new Date(startAt) : new Date(),
      time: NEW_ITEM_TIME,
    },
  });

  return item;
}

module.exports = { getItems, getSoldItems, tick, placeBid, addItem, getItemHistory };
