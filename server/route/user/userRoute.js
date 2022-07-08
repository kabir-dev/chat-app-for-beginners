const router = require("express").Router();
const {
  getAllUser,
  getUserById,
  getUserByQuery,
  signup,
  login,
  refreshToken,
  logout,
  deleteUser,
  updateUser,
} = require("../../controller/user/userController");
const ref_Token_Validator = require("../../middleware/token/ref_Token_Validator");
const acces_Token_Validator = require("../../middleware/token/acces_Token_Validator");
const update_user_info = require("../../middleware/user/update_user_info");
const update_user_validator = require("../../middleware/user/updateUserValidator");

router.get("/users", acces_Token_Validator, getAllUser);
router.get("/user", acces_Token_Validator, getUserByQuery);
router.get("/find/user/:id", acces_Token_Validator, getUserById);

router.put(
  "/update",
  acces_Token_Validator,
  update_user_info,
  update_user_validator,
  updateUser
);

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh_token", ref_Token_Validator, refreshToken);
router.get("/logout", acces_Token_Validator, logout);
router.post("/delete", ref_Token_Validator, deleteUser);

module.exports = router;
