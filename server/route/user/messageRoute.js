const router = require("express").Router();
const {
  getConversationById,
  getMessageById,
  saveConversation,
  saveMessage,
  deleteMessage,
  deleteConversation,
} = require("../../controller/user/messageController");
const acces_Token_Validator = require("../../middleware/token/acces_Token_Validator");

router.get("/conversation/:id", acces_Token_Validator, getConversationById);
router.get("/message/:id", acces_Token_Validator, getMessageById);
router.post("/conversation", acces_Token_Validator, saveConversation);
router.post("/message", acces_Token_Validator, saveMessage);
router.delete("/message/:id", acces_Token_Validator, deleteMessage);
router.delete("/conversation/:id", acces_Token_Validator, deleteConversation);

module.exports = router;
