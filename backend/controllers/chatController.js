import Chat from "../models/Chat.js";

const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };
    await Chat.create(chatData);
    return res.status(200).json({ message: "Chat created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return res.status(200).json({ chats });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const {chatId} = req.body;
    await Chat.deleteOne({_id: chatId, userId})
    return res.status(200).json({message: 'Chat deletion was success.'});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createChat, getChats, deleteChat };
