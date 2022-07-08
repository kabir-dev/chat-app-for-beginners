const createError = require("http-errors");
const Message = require("../../model/Message");
const Conversation = require("../../model/Conversation");
const {
  conversationValidator,
  messageValidator,
} = require("../../utils/validator");

//get conversation by id
exports.getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findConversation = await Conversation.find({
      $or: [{ creator: id }, { participant: id }],
    })
      .populate({ path: "creator", select: ["name", "profile_pic"] })
      .populate({ path: "participant", select: ["name", "profile_pic"] });

    res.send(findConversation);
  } catch (error) {
    next(error);
  }
};
//get message by id
exports.getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findMessage = await Message.find({ conversation_id: id })
      .populate({ path: "creator", select: ["name", "profile_pic"] })
      .populate({ path: "participant", select: ["name", "profile_pic"] })
      .sort("-createdAt");
    const sortArry = findMessage && findMessage.reverse();
    res.send(sortArry);
  } catch (error) {
    next(error);
  }
};
//save conversation
exports.saveConversation = async (req, res, next) => {
  try {
    const result = await conversationValidator.validateAsync(req.body);
    if (result.creator === result.participant) {
      throw createError.Conflict("User can not same!");
    }
    const findConOne = await Conversation.findOne({
      $and: [{ creator: result.creator }, { participant: result.participant }],
    });
    if (findConOne) throw createError.Conflict("Conversation alredy created!");

    const findConTow = await Conversation.findOne({
      $and: [{ creator: result.participant }, { participant: result.creator }],
    });
    if (findConTow) throw createError.Conflict("Conversation alredy created!");

    const newConversation = new Conversation(result);
    const conversation = await newConversation.save();
    const findConversation = await Conversation.find({
      $or: [{ creator: result.creator }, { participant: result.participant }],
    })
      .populate({ path: "creator", select: ["name", "profile_pic"] })
      .populate({ path: "participant", select: ["name", "profile_pic"] });

    res.send(findConversation);
  } catch (error) {
    next(error);
  }
};

//save message
exports.saveMessage = async (req, res, next) => {
  try {
    const result = await messageValidator.validateAsync(req.body);
    const findCon = await Conversation.findOne({ _id: result.conversation_id });
    if (!findCon) throw createError.Conflict("Conversation not found!");

    const newMessage = new Message(result);
    const message = await newMessage.save();

    res.send(message);
  } catch (error) {
    next(error);
  }
};

//delete message
exports.deleteMessage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletMessage = await Message.deleteMany({
      conversation_id: id,
    });
    res.send({ message: "message delete succesfull!" });
  } catch (error) {
    next(error);
  }
};

//delete Conversation
exports.deleteConversation = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleteCon = await Conversation.findByIdAndDelete(id);
    const deletMessage = await Message.deleteMany({
      conversation_id: id,
    });
    res.send({ message: "conversation delete succesfull!" });
  } catch (error) {
    next(error);
  }
};
