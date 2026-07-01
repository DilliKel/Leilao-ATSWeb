require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const { z } = require("zod");
const itemsService = require("./lib/itemsService");
const { bidSchema, addItemSchema } = require("./lib/validation");

const SECOND = 1 * 1000;
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3001";

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

async function broadcastItems() {
  const [items, winners] = await Promise.all([
    itemsService.getItems(),
    itemsService.getSoldItems(),
  ]);

  io.emit("items", items);
  io.emit("winners", winners);
}

function run() {
  setInterval(async () => {
    try {
      await itemsService.tick();
      await broadcastItems();
    } catch (err) {
      console.error("Erro no tick do leilão:", err);
    }
  }, SECOND);
}

run();

io.on("connection", (socket) => {
  socket.on("add_item", async (data) => {
    try {
      const payload = addItemSchema.parse(data);
      await itemsService.addItem(payload);
      await broadcastItems();
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.warn("Payload inválido em add_item:", err.issues);
      } else {
        console.error("Erro ao adicionar item:", err);
      }
    }
  });

  socket.on("bid", async (data) => {
    try {
      const payload = bidSchema.parse(data);
      const applied = await itemsService.placeBid(payload);
      if (applied) {
        await broadcastItems();
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.warn("Payload inválido em bid:", err.issues);
      } else {
        console.error("Erro ao registrar lance:", err);
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
