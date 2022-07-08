const path = require("path");
const { unlink } = require("fs");
const createError = require("http-errors");
const User = require("../../model/User");
const Token = require("../../model/Token");
const {
  signupValidator,
  loginValidator,
  objectIdValidator,
  searchQueryValidator,
} = require("../../utils/validator");
const { signAccessToken, signRfreshToken } = require("../../utils/token");
const Conversation = require("../../model/Conversation");
const Message = require("../../model/Message");

//get all user
exports.getAllUser = async (req, res, next) => {
  try {
    const allUser = await User.find({});

    if (allUser.length === 0) throw createError.NotFound("user does not exist");
    res.status(200).json(allUser);
  } catch (error) {
    next(error);
  }
};

//get one user by query
exports.getUserByQuery = async (req, res, next) => {
  try {
    const { search } = req.query;
    const userId = req.userId;

    const result = await searchQueryValidator.validateAsync({ search });

    const name_search_regex = new RegExp(escape(result.search), "i");
    const email_search_regex = new RegExp(
      "^" + escape(result.search) + "$",
      "i"
    );

    const findUser = await User.find({
      $or: [{ name: name_search_regex }, { email: email_search_regex }],
    });

    res.status(200).json(findUser);
  } catch (error) {
    next(error);
  }
};
//get one user by id
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await objectIdValidator.validateAsync({ id });
    const findUser = await User.findById(result.id);
    if (!findUser) {
      throw createError.Unauthorized("Samething wan't wrong");
    }

    res.status(200).json(findUser);
  } catch (error) {
    next(error);
  }
};

// signup
exports.signup = async (req, res, next) => {
  try {
    const result = await signupValidator.validateAsync(req.body);
    const existUser = await User.findOne({ email: result.email });
    if (existUser) {
      throw createError.Conflict(`${result.email} is alredy been registerd.`);
    }

    const user = new User(result);
    const saveUser = await user.save();

    const access_token = await signAccessToken(saveUser.id);
    const refresh_token = await signRfreshToken(saveUser.id);

    const token = new Token({
      user_id: saveUser.id,
      refresh_token: refresh_token,
    });
    await token.save();

    res.status(200).json({ access_token, refresh_token });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

//login
exports.login = async (req, res, next) => {
  try {
    const result = await loginValidator.validateAsync(req.body);
    const findUser = await User.findOne({ email: result.email });

    if (!findUser) {
      throw createError.Unauthorized("invalid email or password");
    }
    const passMatch = await findUser.isValidPassword(result.password);
    if (!passMatch) {
      throw createError.Unauthorized("invalid email or password");
    }

    const userId = String(findUser._id);

    const access_token = await signAccessToken(userId);
    const refresh_token = await signRfreshToken(userId);

    const findToken = await Token.findOne({ user_id: findUser._id });
    if (!findToken) {
      const token = new Token({
        user_id: findUser.id,
        refresh_token: refresh_token,
      });
      await token.save();
    } else {
      await Token.findOneAndUpdate(
        { user_id: findUser._id },
        { refresh_token: refresh_token },
        { new: true }
      );
    }

    res.status(200).json({ access_token, refresh_token });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

//refresh_token
exports.refreshToken = async (req, res, next) => {
  try {
    const findToken = await Token.findOne({ userId: req.userId });
    if (!findToken) {
      throw createError.Unauthorized();
    }

    const matchToken = req.token === findToken.refresh_token;
    if (!matchToken) {
      throw createError.Unauthorized("Token is blacklist");
    }

    const access_token = await signAccessToken(req.userId);
    const refresh_token = await signRfreshToken(req.userId);

    await Token.findOneAndUpdate(
      { user_id: req.userId },
      { refresh_token: refresh_token },
      { new: true }
    );

    res.status(200).json({ access_token, refresh_token });
  } catch (error) {
    next(error);
  }
};

//logout
exports.logout = async (req, res, next) => {
  try {
    const findToken = await Token.findOne({ userId: req.userId });
    if (!findToken) {
      throw createError.Unauthorized();
    }

    const matchToken = req.token === findToken.refresh_token;
    if (!matchToken) {
      throw createError.Unauthorized("Token is blacklist");
    }

    await Token.findOneAndDelete({ user_id: req.userId });

    res.status(200).json({ message: "logout succesfull" });
  } catch (error) {
    next(error);
  }
};

//update user
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { name } = req.result;

    const findUser = await User.findById(userId);
    if (findUser) {
      if (req.files.length > 0) {
        if (findUser.profile_pic !== "default.png") {
          unlink(
            path.join(
              `${__dirname}/../../public/upload/${findUser.profile_pic}`
            ),
            (err) => {
              if (err) throw createError.InternalServerError();
            }
          );
        }
      }
    }

    let obj = {};
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      obj = {
        name: name,
        profile_pic: filename,
      };
    } else {
      obj = {
        name: name,
      };
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: obj,
      },
      { new: true }
    );

    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
};
//delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const isExist = await User.findById(userId);

    if (!isExist) {
      throw createError.Unauthorized("Samething wan't wrong");
    }
    const deleteConversation = await Conversation.deleteMany({
      $or: [{ creator: userId }, { participant: userId }],
    });
    const deleteMessage = await Message.deleteMany({
      $or: [{ creator: userId }, { participant: userId }],
    });

    const findToken = await Token.findOneAndDelete({ user_id: userId });
    if (!findToken) throw createError.Unauthorized();

    const findUserProfile = await User.findById(userId);
    if (findUserProfile) {
      if (findUserProfile.profile_pic !== "default.png") {
        unlink(
          path.join(
            `${__dirname}/../../public/upload/${findUserProfile.profile_pic}`
          ),
          (err) => {
            console.log(err);
          }
        );
      }
    }

    const findUser = await User.findByIdAndDelete({ _id: userId });
    if (!findUser) throw createError.Unauthorized();

    res.status(200).json({ message: "user delete succesfull" });
  } catch (error) {
    next(error);
  }
};
