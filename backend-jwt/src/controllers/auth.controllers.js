import { newConnection } from "../db/database.js";
import generarJwt from "../helpers/generar-jwt.js";
import bcrypt from 'bcryptjs'

//Ruta para manejar el registro de usuario
export const Register = async (req,res) => {
    const { username, password } = req.body

    try {
        const connection = await newConnection()
        

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //Registrar usuario
        const [result] = await connection.query(`
            INSERT INTO users (username, password)
            VALUES (?,?)`, [username, hashedPassword])

            res.status(201).json({
                msg: 'Registrado correctamente'
            })
    } catch (error) {
        console.error('Ocurrió un error', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
}

export const Login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Crear una nueva conexión a la base de datos
        const connection = await newConnection();

        // Consultar el usuario en la base de datos
        const [user] = await connection.query(
            'SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1',
            [username, password]
        );

        // Validación de usuario
        if (user.length === 0) {
            connection.end();  // Cerrar la conexión si no se encuentra el usuario
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = await generarJwt(user[0].id);

        // Almacenar el token en la sesión del servidor
        req.session.token = token;

        // Almacenar el token en una cookie segura
        res.cookie('authToken', token, {
            httpOnly: true, // La cookie no es accesible desde JavaScript
            secure: false, // Cambiar a true en producción con HTTPS
            maxAge: 3600000 // Expiración en milisegundos (1 hora)
        });

        connection.end();  // Cerrar la conexión después de la operación
        return res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};

// Ruta para obtener los datos de la sesión
export const Session = (req, res) => {
    console.log(req.user);
    return res.json({ message: 'Acceso permitido a área protegida', user: req.user });
};

export const Logout = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }

            res.clearCookie('authToken');
            return res.json({ message: 'Cierre de sesión exitoso' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};