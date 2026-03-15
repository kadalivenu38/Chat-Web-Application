import dotenv from "dotenv";
dotenv.config();

import ImageKit from "@imagekit/nodejs";

const imgKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export default imgKit;
