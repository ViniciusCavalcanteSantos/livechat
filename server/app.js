const corsOptions = {credentials: true, origin: "http://localhost:3000"};

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const io = (require("socket.io"))(server, {cors: corsOptions});
const cookieParser = require('cookie-parser');

// MODELS
const user = require("./models/user");
const messageModel = require("./models/message");

// SESSION
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
(async() => {
    const sessionStore = new MySQLStore({
        createDatabaseTable: true,
        expiration: 60000 * 60 * 24,
    }, await require("./models/db").connect());
    const sessionMiddleware = session({
        secret: "minha-chave-secreta",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 60 * 24, // Tempo limite da sessão em milissegundos (1 Dia)
            secure: false, // Defina como 'true' se estiver usando HTTPS
            httpOnly: true, // Impede que o cookie seja acessado por JavaScript no cliente
        },
        store: sessionStore
    });

    // SESSION MIDDLEWARE
    app.use(sessionMiddleware);
    io.engine.use(sessionMiddleware);

    app.post('/entrar', async(req, res) => {
        const result = await user.entrar(req.body.username, req.body.senha);
        if(result.status) {
            req.session.authenticated = true;
            req.session.user = result.user;
            req.session.save();
        }

        res.json({status: result.status, message: result.message, user: {id: result.user.id, username: result.user.username}});
    });

    app.post('/cadastrar', async(req, res) => {
        const result = await user.criarConta(req.body.username, req.body.senha);

        res.json({status: result.status, message: result.message});
    });

    // SOCKET.IO CONEXÃO
    io.on("connection", (socket) => {
        console.log("Usuário conectado.");
        const session = socket.request.session;

        socket.use((packet, next) => {
            socket.event = packet[0];
            user.requireAuthentication(socket, next);
        });

        // PRICIPAIS AÇÔES
        socket.on("getContacts", async (callback) => {
            const contacts = await user.getContactsOf(session.user.username);
            callback(contacts);
        });

        socket.on("getMessages", async ({userId}, callback) => {
            const messages = await messageModel.getMessagesOf(session.user.id, userId);
            callback(messages);
        });

        socket.on("sendMessage", async ({message, to}, callback) => {
            const userTo = await user.getUser(to);
            if(!userTo) {
                return callback({status: false});
            }

            const contacts = await messageModel.sendMessage(message, session.user.id, to);

            socket.to(userTo.username).emit("sendMessage", {id: session.user.id, message: message});
            callback({username: session.user.username, message: message})
        });

        // OUTRAS AÇÔES
        socket.on("isAuthorized", (args, callback) => {
            if(session.authenticated) {
                callback({status: true, username: session.username});
            }

            callback({status: false});
        });

        socket.on("disconnect", () => console.log("Usuário disconectado"));
    })

    const PORT = 4000;
    server.listen(PORT, () => {
        console.log("Ouvindo na porta: " + PORT);
    })
})();
