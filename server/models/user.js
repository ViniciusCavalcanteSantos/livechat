const db = require("./db");
const bcrypt = require("bcrypt");

/**
 * Middleware que gerencia os métodos que o usuário pode acessar
 *
 * @param socket
 * @param next
 */
function requireAuthentication(socket, next) {
    if(socket.event === "entrar" || socket.event === "criar-conta") {
        next();
    } else if(socket.request.session.authenticated) {
        next();
    } else {
        socket.emit("desautorizado");
        socket.disconnect();
    }
}

/**
 * Tenta realizar login do usuário e retorna o resultado
 *
 * @param {String} username
 * @param {String} senha
 * @returns {Object}
 */
async function entrar(username, senha) {
    const connection = await db.connect();

    try {

        const [rows] = await connection.execute("SELECT * FROM user WHERE username = ?", [username]);
        if(!rows.length) {
            return {status: false, message: "Usuário ou senha incorretos."};
        }

        const result = await bcrypt.compare(senha, rows[0].senha);
        if(!result) {
            return {status: false, message: "Usuário ou senha incorretos."};
        }

        return {status: true, message: "Seu login foi realizado com sucesso.", user: rows[0]};
    } catch(err) {
        return {status: false, message: "Não foi possivel criar sua conta."};
    }
}

/**
 * Tenta inserir um usuário na tabela e retorna o resultado
 *
 * @param {String} username
 * @param {String} senha
 * @returns {Object}
 */
async function criarConta(username, senha) {
    const connection = await db.connect();

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        await connection.execute(
            "INSERT INTO user (username, senha) VALUES (?, ?)",
            [username, senhaHash]
        )

        return {status: true, message: "Conta criada com sucesso."};
    } catch(err) {
        if(err.errno === 1062) {
            return {status: false, message: "Nome de usuário já esta em uso."};
        }

        return {status: false, message: "Não foi possivel criar sua conta."};
    }
}

module.exports = {entrar, criarConta, requireAuthentication}