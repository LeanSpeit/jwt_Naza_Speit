import { Router } from "express";
import { Register, Login, Session, Logout } from "../controllers/auth.controllers.js";
import validarJwt from "../middlewares/validar-jwt.js";

const authRouter = Router();

authRouter.post('/Register', Register);
authRouter.post("/login", Login);
authRouter.get("/Session", validarJwt, Session);
authRouter.post("/Logout", Logout);

export { authRouter }