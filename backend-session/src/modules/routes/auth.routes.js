import { Router } from "express";
import { Register, Login, Session, Logout } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post('/Register', Register);
authRouter.post("/login", Login);
authRouter.get("/Session", Session);
authRouter.post("/Logout", Logout);

export { authRouter }