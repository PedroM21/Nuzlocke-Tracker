import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

const authRoutes = Router();

authRoutes.post("/sign-up", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate user input
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Save the new user and hashed password to the database
  try {
    // Check to see if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // encypt password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // save user to database
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Give them a empty default ruleset
    const defaultRuleset = "";

    await prisma.ruleset.create({
      data: {
        userId: user.id,
        ruleSetText: defaultRuleset,
      },
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

// handles user log in
authRoutes.post("/log-in", async (req, res) => {
  const { username, password } = req.body;

  // Validate user input
  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (!existingUser) {
      return res.status(404).json({ message: "Account not found." });
    }

    // check if password is valid
    const passwordIsValid = bcrypt.compareSync(password, existingUser.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // if user & password are valid then authentication successful
    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

export default authRoutes;
