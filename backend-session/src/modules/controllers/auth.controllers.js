import { newConnection } from "../db/database.js";
import bcrypt from 'bcryptjs'

//Ruta para manejar el registro de usuario
export const Register = async (req,res) => {
    const { username, password } = req.body

    try {
        const connection = await newConnection()
        
        // Verificar si el usuario ya existe
        const [userExists] = await connection.query(
            `SELECT * FROM users WHERE username =?`, 
            [username]
        );
        
        if (userExists) {
            return res.status(400).json({ msg: 'El nombre de usuario ya está en uso' });
        }

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

// Ruta para manejar el inicio de sesión
export const Login = async  (req, res) => {
    const { username, password } = req.body;
    

    // Buscar usuario
    try {
        const connection = await newConnection();
        const [userSearch] = await connection.query(
            `SELECT * FROM users WHERE username = ?`, 
            [username]
        );

        if (userSearch.length === 0 || userSearch[0].password !== password) {
            return res.status(401).json({msg: 'Credenciales incorrectas'});
        } else {
            return res.status(200).json({msg: 'Inicio de sesión exitoso'});
        }
    } catch (error) {
        console.error('Ocurrió un error', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
};

// Ruta para obtener los datos de la sesión
export const Session = async (req, res) => {
    if (req.session.userId) {
        return res.json({ 
            loggedIn: true, 
            user: { id: req.session.userId, username: req.session.username } });
    } else {
        return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
    }
};

// Ruta para cerrar la sesión
export const Logout = (req, res) => {
    console.log(req.session)
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ msg: 'Error al cerrar la sesión' });
        }
        res.clearCookie('connect.sid'); // Nombre de cookie por defecto para express-session
        return res.json({ msg: 'Sesión cerrada exitosamente' });
    });
};