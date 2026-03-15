import imgKit from "../config/imageKit.js";
import gemini from "../config/gemini.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";


// TEXT GENERATION
const textMessage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.status(409).json({
        message: "You don't have enough credits",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // store user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Gemini text generation
    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const parts = response?.candidates?.[0]?.content?.parts;
    const replyText = parts?.find((p) => p.text)?.text;
    const reply = {
      role: "assistant",
      content: replyText,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// IMAGE GENERATION
const imageMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { prompt, chatId, isPublished } = req.body;

    // Credit check
    if (req.user.credits < 2) {
      return res.status(409).json({
        message: "You don't have enough credits",
      });
    }

    // Prompt validation
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    // Find chat
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    // Generate image using Gemini
    const response = await gemini.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: prompt,
    });

    const parts = response?.candidates?.[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      return res.status(500).json({
        message: "Image generation failed",
      });
    }

    let buffer = null;
    for (const part of parts) {
      if (part.inlineData?.data) {
        buffer = Buffer.from(part.inlineData.data, "base64");
        break;
      }
    }

    if (!buffer) {
      return res.status(500).json({
        message: "No image returned from AI",
      });
    }

    // Upload image to ImageKit
    const upload = await imgKit.files.upload({
      file: buffer,
      fileName: `${Date.now()}.png`,
      folder: "QuickGPT",
    });
    const imageUrl = upload.url;

    // Create reply message
    const reply = {
      role: "assistant",
      content: imageUrl,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    // Save chat messages
    chat.messages.push(
      {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
        isImage: false,
      },
      reply,
    );

    // Save DB changes
    await Promise.all([
      chat.save(),
      User.updateOne({ _id: userId }, { $inc: { credits: -2 } }),
    ]);

    // Send response
    return res.status(200).json({ reply });
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({
        message: "Gemini rate limit exceeded. Try again in a few seconds.",
      });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { textMessage, imageMessage };