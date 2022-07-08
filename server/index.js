require("dotenv").config();
require("./db/dbConfig");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

//internal import
const { errorHandlear, notFound } = require("./middleware/common/errorHandler");
const userRouter = require("./route/user/userRoute");
const messageRoute = require("./route/user/messageRoute");

const middleware = [
  morgan("dev"),
  cors({ origin: "http://localhost:3000" }),
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(path.join(__dirname, "public")),
];

app.use(middleware);
app.use("/api", userRouter);
app.use("/api", messageRoute);

//store current user
let users = [];

// // add user
// const addUser = (userId, socketId) => {
//   if (!users.some((user) => user.userId === userId)) {
//     users.push({ userId, socketId });
//   }
// };
// // remove user
// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };
// //get user
// const getUser = (userId) => {
//   return users.find((user) => user.userId === userId);
// };

// //socket io
io.on("connection", function (socket) {
  //user add event
  socket.on("add_user", (userId) => {
    if (!users.some((user) => user.userId === userId)) {
      users.push({ userId: userId, socketId: socket.id });
    }
    // console.log("add_user", users);
    io.emit("get_users", users);
  });
  //remove user
  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("get_users", users);
    // console.log("remove_user", users);
  });
  //send message
  socket.on("send_message", (data) => {
    const reciverId = data.participant;
    const user = users.find((user) => user.userId === reciverId);
    if (user) {
      io.to(user.socketId).emit("new_message", data);
    }
  });
});

//not found
app.use(notFound);
//error handler
app.use(errorHandlear);

const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
