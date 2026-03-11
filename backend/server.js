import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import dbConn from "./config/db.js";

const app = express();
await dbConn();

// middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Antha Assam..." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
