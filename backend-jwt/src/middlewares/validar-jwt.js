import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../config/env.js';
import { newConnection } from '../db/database.js';

// Middleware para verificar el token JWT
export default async (req, res, next) => {
    console.log(req.session)
    console.log('-----------')
    console.log(req.cookies)
    const token = req.cookies.authToken || req.session.token;

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    try {
        // Verificar y decodificar el token JWT
        const decoded = jwt.verify(token, SECRET_KEY);

        // Crear una nueva conexión a la base de datos
        const connection = await newConnection();

        // Buscar al usuario en la base de datos por el ID obtenido del token
        const [user] = await connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [decoded.userId]);

        if (user.length === 0) {
            connection.end();  // Cerrar la conexión si no se encuentra el usuario
            return res.status(401).json({ message: 'Token inválido' });
        }

        // Agregar la información del usuario al request
        req.user = user[0];

        connection.end();  // Cerrar la conexión después de la operación

        next();  // Pasar al siguiente middleware
    } catch (error) {
        console.error('Ocurrió un error', error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};