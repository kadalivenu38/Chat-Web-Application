import dotenv from 'dotenv';
dotenv.config();

import ImageKit from "@imagekit/nodejs";

const imgKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

export default imgKit;