const http = require("http");
const { Server } = require("socket.io");
const originalData = require("./data.json");

const SECOND = 1 * 1000;

let db = originalData;
const httpServer = http.createServer();
console.log(new Date());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
// cria o servidor HTTP;
// configura o Socket.IO para ouvir nesse servidor;
// Especifica a origem permitida para conexões do cliente (CORS).


function getItems() {  // Retorna itens não vendidos com tempo restante maior que zero
  const data = db.map((item) => {
    if (!item.startAt) {
      item.startAt = new Date().toISOString();
    }
    return item;
  }).filter(
    (item) =>
      !item.sold && item.time > 0 && Date.parse(item.startAt) <= new Date(),
  );

  return data;
}

function getSoldItems() {  // Retorna itens vendidos
  const data = db.filter((item) => item.sold);

  return data;
}

function run() {
  setInterval(() => {  // A magia por trás do servidor
    db = db
      .filter((item) => !item.sold)
      .map((item) => {
        if (item.time === 1) {
          item.sold = true;
        }

        item.time -= 1;

        return item;
      }); 

    io.emit("items", getItems());
    io.emit("winners", getSoldItems());

    items = getItems();
  }, SECOND);
}

run();

io.on("connection", (socket) => { //  Evento quando um cliente se conecta.
  socket.on("add_item", (data) => {  // Evento para adicionar um novo item ao leilão.
    db.push({
      id: db.length + 1,
      nome_prod: data[0],
      descricao: data[1],
      image: data[2],
      valor: 0,
      time: 60,
      sold: false,
      startAt: data[3],
      bidders: [],
    });
  });

  socket.on("bid", (data) => {  //Evento para registrar um lance em um item.
    console.log(`Received bid event for item ${data[0]} by user ${data[1]}`);
    db = db.map((item) => {
        if (item.id === data[0]) {
            item.time = 60;
            item.valor = (parseFloat(item.valor) + 0.01).toFixed(2);
            item.bidders.push(data[1]);
            console.log(`Updated item ${item.id}:`, item);
        }

        return item;
    });

    io.emit("items", getItems());
});
});

const PORT = 3000; 

httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
// Inicia o servidor na porta 3000.
