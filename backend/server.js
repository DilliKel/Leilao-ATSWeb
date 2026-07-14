require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const itemsService = require("./lib/itemsService");
const { bidSchema, addItemSchema, itemIdSchema } = require("./lib/validation");

const SECOND = 1 * 1000;
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3001";
const SOCKET_JWT_SECRET = process.env.SOCKET_JWT_SECRET;
const BID_COOLDOWN_MS = 400;

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

// Evita spam de lances: no mínimo BID_COOLDOWN_MS entre lances do mesmo usuário autenticado.
const lastBidAt = new Map();

function isRateLimited(userName) {
  const now = Date.now();
  const last = lastBidAt.get(userName) || 0;
  if (now - last < BID_COOLDOWN_MS) {
    return true;
  }
  lastBidAt.set(userName, now);
  return false;
}

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

io.on("connection", async (socket) => {
  try {
    const [items, winners] = await Promise.all([
      itemsService.getItems(),
      itemsService.getSoldItems(),
    ]);
    socket.emit("items", items);
    socket.emit("winners", winners);
  } catch (err) {
    console.error("Erro ao enviar estado inicial:", err);
  }

  socket.on("get_history", async (itemId, callback) => {
    if (typeof callback !== "function") {
      return;
    }

    const parsed = itemIdSchema.safeParse(itemId);
    if (!parsed.success) {
      return callback({ error: "Item inválido." });
    }

    try {
      const history = await itemsService.getItemHistory(parsed.data);
      callback({ history });
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      callback({ error: "Erro ao buscar histórico." });
    }
  });

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
    if (isRateLimited(socket.data.userName)) {
      socket.emit("bid_rejected", { reason: "rate_limited" });
      return;
    }

    try {
      const { itemId } = bidSchema.parse(data);
      const applied = await itemsService.placeBid({ itemId, userName: socket.data.userName });
      if (applied) {
        await broadcastItems();
      } else {
        socket.emit("bid_rejected", { reason: "item_expired" });
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
