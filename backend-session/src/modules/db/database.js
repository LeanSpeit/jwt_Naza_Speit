import mysql2 from "mysql2/promise"

const newConnection = async () => {

try {
    const connection = await mysql2.createConnection({
        host: "localhost",
        user: "root",
        database: "db_system"
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
