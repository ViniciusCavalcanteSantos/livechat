const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const io = (require("socket.io"))(server, {cors: {origin: "http://localhost:3000"}});
const user = require("./models/user");

app.use(cors());

// SESSÂO
const session = require("express-session");
const sessionMiddleware = session({
  secret: "SEU-CODIGO-SECRETO",
  resave: false,
  saveUninitialized: false
});

// EXPRESS
app.use(sessionMiddleware);
app.post("/criar-conta", async (req, res) => {
  res.send(result);
});

// SOCKET.IO SESSION MIDDLEWARE
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// SOCKET.IO
io.on("connection", (socket) => {

  socket.use((packet, next) => {
      socket.event = packet[0];
      user.requireAuthentication(socket, next);
  });

  // LOGIN E CADASTRO DO USUÁRIO
  socket.on("entrar", async ({username, senha}, callback) => {
    const result = await user.entrar(username, senha);
    socket.request.session.authenticated = true;
    socket.request.session.user = result.user;

    callback({status: result.status, message: result.message});
  });

  socket.on("criar-conta", async ({username, senha}, callback) => {
    const result = await user.criarConta(username, senha);

    callback(result);
  });

  socket.on("disconnect", () => console.log("Usuário disconectado"))
})

const PORT = 4000;
server.listen(PORT, () => {
  console.log("Ouvindo na porta: " + PORT);
})