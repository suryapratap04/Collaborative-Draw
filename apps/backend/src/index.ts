import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import bcrypt from "bcrypt";
import cors from "cors";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "123123";

const allowedOrigins = ["https://collaborative-draw.vercel.app/"];

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", async (req: Request, res: Response) => {
  const krish = await prismaClient.user.findFirst({
    where: {
      email: "Krishna@gmail.com",
    },
  });
  console.log("Krishna :", krish);
  res.status(200).json({
    success: true,
    message: "Welcome to the Collaborative Draw Backend",
  });
  return;
});

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    // console.log(parsedData.error);
    res.status(400).json({
      success: false,
      message: "Incorrect inputs",
    });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.email,
        password: hashedPassword,
        name: parsedData.data?.name,
      },
    });
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
    return;
  } catch (e) {
    res.status(411).json({
      success: false,
      message: "User already exists with this username",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).json({
      success: false,
      message: "Incorrect inputs or missing fields",
    });
    return;
  }
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    if (!user) {
      res.status(403).json({
        success: false,
        message: "Incorrect email or username",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      parsedData.data.password,
      user.password
    );
    if (!isPasswordCorrect) {
      res.status(403).json({
        success: false,
        message: "Incorrect password",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user?.id,
      },
      JWT_SECRET
    );

    // Set the cookie
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; Path=/; SameSite=Strict`
    );

    res.status(200).json({
      username: user.name,
      userId: user.id,
      token,
    });
    return;
  } catch (e) {
    console.error("Signin error:", e);
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  // @ts-ignore: TODO: Fix this
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    // console.log(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    //// console.log(e);
    res.json({
      messages: [],
    });
  }
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,
  });
});

app.listen(PORT, () => {
  console.log(`App is Running on the PORT : ${PORT}`);
});
