const db = require("./db");

async function sendMessage(message, idFrom, idTo) {
    const connection = await db.connect();
    try {
        const result = await connection.execute(
            "INSERT INTO `message` (`message`, `id_from`, `id_to`) VALUES (?, ?, ?)",
            [message, idFrom, idTo]);

        return {status: true, result: result};
    } catch(err) {
        return {status: false, message: "Não foi possivel enviar sua mensagem."};
    }
}

module.exports = {sendMessage}