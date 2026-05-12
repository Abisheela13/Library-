const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());


// ================= AUTH MIDDLEWARE =================

function auth(req, res, next) {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "No Token"
    });
  }

  try {

    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    next();

  } catch {

    return res.status(401).json({
      msg: "Invalid Token"
    });
  }
}


// ================= REGISTER =================

app.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const oldUser = await prisma.user.findUnique({
      where: { email }
    });

    if (oldUser) {
      return res.status(400).json({
        msg: "Email already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role: "USER"
      }
    });

    res.json(user);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Server Error"
    });
  }
});


// ================= LOGIN =================

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        msg: "User not found"
      });
    }

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    console.log(valid);

    if (!valid) {
      return res.status(400).json({
        msg: "Wrong Password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      user
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Server Error"
    });
  }
});


// ================= CREATE ADMIN =================

async function createAdmin() {

  try {

    const hash = await bcrypt.hash(
      "123456",
      10
    );

    await prisma.user.upsert({
      where: {
        email: "abi@gmail.com"
      },

      update: {
        password: hash,
        role: "ADMIN"
      },

      create: {
        name: "Admin",
        email: "abi@gmail.com",
        password: hash,
        role: "ADMIN"
      }
    });

    console.log("Admin Ready");

  } catch (err) {

    console.log("Admin Create Error");

    console.log(err);
  }
}

// ================= START SERVER =================

async function startServer() {

  await createAdmin();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {

    console.log(`Server Running on ${PORT}`);

  });
}

startServer();


// ================= ROOT =================

app.get("/", (req, res) => {
  res.send("Library Backend Running");
});