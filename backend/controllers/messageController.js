import imgKit from "../config/imageKit.js";
import openai from "../config/openai.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";

// Text Generation
const textMessage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.status(409).json({
        message: "You don't have enough credits to use this feature.",
      });
    }
    const { chatId, prompt } = req.body;

    // Finding Chat
    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Calling the gemini api
    const { choices } = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful, friendly neighbourhood AI assistant like ChatGPT & Claude.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };
    res.status(200).json({ reply });

    // saving the response into DB(Chat, User models)
    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Image Generation
const imageMessage = async (req, res) => {
  try {
    const userId = req.user._id;

    //  checking credits
    if (req.user.credits < 2) {
      return res.status(409).json({
        message: "You don't have enough credits to use this feature.",
      });
    }
    const { prompt, chatId, isPublished } = req.body;

    // Find chat
    const chat = await Chat.findOne({ userId, _id: chatId });
    // Push user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Encode the prompt
    const encodedPrompt = encodeURIComponent(prompt);

    // Construct ImageKit AI generation URL
    const generatedImgUrl = `${process.env.IMAGEKIT_URL}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-550,h-600`;
    const imgResponse = await axios.get(generatedImgUrl, {
      responseType: "arraybuffer",
    });

    // Convert img into a Base64 URL
    const base64Img = `data:image/png;base64,${Buffer.from(imgResponse.data, "binary").toString("base64")}`;

    // Upload Base64 URL into ImageKit Media Library
    const uploadResponse = await imgKit.upload({
      file: base64Img,
      fileName: `${Date.now()}.png`,
      folder: "QuickGPT",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    return res.status(200).json({ reply });

    // saving the response into DB(Chat, User models)
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { textMessage, imageMessage };
