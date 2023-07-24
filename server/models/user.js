const db = require("./db");
const bcrypt = require("bcrypt");

/**
 * Middleware que gerencia os métodos que o usuário pode acessar
 *
 * @param socket
 * @param next
 */
function requireAuthentication(socket, next) {
    if(socket.event === "isAuthorized") {
        next();
    } else if(socket.request.session.authenticated) {
        socket.join(socket.request.session.user.username);
        next();
    } else {
        socket.emit("unauthorized");
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

async function getContactsOf(username) {
    const connection = await db.connect();

    try {
        const contacts = await connection.execute(`
            SELECT u.id, u.username, m.message AS last_message, m.created_at AS last_message_created_at
            FROM user u
            LEFT JOIN message m ON u.id = m.id_from OR u.id = m.id_to
            WHERE u.username <> ? AND (m.id IS NULL OR m.id = (
                SELECT id
                FROM message
                WHERE id_from = u.id OR id_to = u.id
                ORDER BY created_at DESC
                LIMIT 1
        )) ORDER BY last_message_created_at DESC
        `, [username]);

        return {status: true, contacts: contacts[0]};
    } catch(err) {
        return {status: false, message: "Não foi possivel obter seus contatos."};
    }
}

async function getUser(id) {
    const connection = await db.connect();

    try {
        return (await connection.execute("SELECT * FROM user WHERE id = ? LIMIT 1", [id]))[0][0];
    } catch(err) {
        return null;
    }
}

module.exports = {entrar, criarConta, getUser, requireAuthentication, getContactsOf}