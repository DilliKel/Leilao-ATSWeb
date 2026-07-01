require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const itemsService = require("./lib/itemsService");
const { bidSchema, addItemSchema } = require("./lib/validation");

const SECOND = 1 * 1000;
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3001";
const SOCKET_JWT_SECRET = process.env.SOCKET_JWT_SECRET;

if (!SOCKET_JWT_SECRET) {
  throw new Error("SOCKET_JWT_SECRET não configurado em backend/.env");
}

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Só aceita conexões com um token válido emitido pelo frontend após login (ver app/api/socket-token).
io.use((socket, next) => {
  const { token } = socket.handshake.auth || {};

  if (!token) {
    return next(new Error("unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, SOCKET_JWT_SECRET);
    socket.data.userName = decoded.name;
    next();
  } catch (err) {
    next(new Error("unauthorized"));
  }
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
      const { itemId } = bidSchema.parse(data);
      const applied = await itemsService.placeBid({ itemId, userName: socket.data.userName });
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
