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

app.post("/api/register", async (req, res) => {

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

app.post("/api/login", async (req, res) => {

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


// ================= BOOKS =================

// GET ALL BOOKS

app.get("/api/books", auth, async (req, res) => {

  const books = await prisma.book.findMany();

  res.json(books);
});


// ADD BOOK

app.post("/api/books", auth, async (req, res) => {

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      msg: "Admin only"
    });
  }

  const book = await prisma.book.create({
    data: {
      title: req.body.title,
      author: req.body.author,
      stock: Number(req.body.stock),
      description: req.body.description
    }
  });

  res.json(book);
});


// EDIT BOOK

app.put("/api/books/:id", auth, async (req, res) => {

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      msg: "Admin only"
    });
  }

  const book = await prisma.book.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
      title: req.body.title,
      author: req.body.author,
      stock: Number(req.body.stock),
      description: req.body.description
    }
  });

  res.json(book);
});


// DELETE BOOK

app.delete("/api/books/:id", auth, async (req, res) => {

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      msg: "Admin only"
    });
  }

  await prisma.book.delete({
    where: {
      id: Number(req.params.id)
    }
  });

  res.json({
    msg: "Book Deleted"
  });
});


// ================= BORROW =================

// BORROW BOOK

app.post("/api/borrow/:id", auth, async (req, res) => {

  const book = await prisma.book.findUnique({
    where: {
      id: Number(req.params.id)
    }
  });

  if (!book) {
    return res.status(404).json({
      msg: "Book not found"
    });
  }

  if (book.stock <= 0) {
    return res.status(400).json({
      msg: "Out Of Stock"
    });
  }

  await prisma.borrow.create({
    data: {
      userId: req.user.id,
      bookId: book.id,
      status: "BORROWED"
    }
  });

  await prisma.book.update({
    where: {
      id: book.id
    },
    data: {
      stock: book.stock - 1
    }
  });

  res.json({
    msg: "Book Borrowed"
  });
});


// RETURN REQUEST

app.post("/api/return/:id", auth, async (req, res) => {

  await prisma.borrow.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
      status: "RETURN_REQUESTED"
    }
  });

  res.json({
    msg: "Return Requested"
  });
});


// APPROVE RETURN

app.post("/api/approve/:id", auth, async (req, res) => {

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      msg: "Admin only"
    });
  }

  const borrow = await prisma.borrow.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
      status: "RETURNED"
    },
    include: {
      book: true
    }
  });

  await prisma.book.update({
    where: {
      id: borrow.bookId
    },
    data: {
      stock: borrow.book.stock + 1
    }
  });

  res.json({
    msg: "Return Approved"
  });
});


// ================= HISTORY =================

// USER HISTORY

app.get("/api/history", auth, async (req, res) => {

  const data = await prisma.borrow.findMany({
    where: {
      userId: req.user.id
    },
    include: {
      book: true
    }
  });

  res.json(data);
});


// ADMIN HISTORY

app.get("/api/history/all", auth, async (req, res) => {

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      msg: "Admin only"
    });
  }

  const data = await prisma.borrow.findMany({
    include: {
      user: true,
      book: true
    }
  });

  res.json(data);
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

    console.log(err);
  }
}


// ================= ROOT =================

app.get("/", (req, res) => {
  res.send("Library Backend Running");
});


// ================= START SERVER =================

async function startServer() {

  await createAdmin();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
  });
}

startServer();