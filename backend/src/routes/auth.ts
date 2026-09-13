import { Router, Request, Response } from "express";
import { User } from "../models/User.js";

const router = Router();

// Регистрация
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Пользователь уже существует" });
      return;
    }

    const newUser = new User({ username, password, isOnline: false });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Успешная регистрация", userId: newUser._id });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка сервера",
      error: error instanceof Error ? error.message : error,
    });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      res.status(400).json({ message: "Неверное имя пользователя или пароль" });
      return;
    }

    res.status(200).json({ message: "Успешный вход", username: user.username });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка сервера",
      error: error instanceof Error ? error.message : error,
    });
  }
});

export default router;
