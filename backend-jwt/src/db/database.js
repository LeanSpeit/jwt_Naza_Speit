import mysql2 from "mysql2/promise"
import { DB_HOST, DB_USER, DB_NAME } from "../config/env.js"

const newConnection = async () => {

try {
    const connection = await mysql2.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_NAME,
    })

    await connection.connect()
    console.log("conectado a la base de datos correctamente");

    return connection
} catch (error) {
    console.log("error al conectarse", error);
}
}

export {
    newConnection
}