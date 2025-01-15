const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config()

app.use(express.json());
app.use(cors())
app.use("/api/users", require("./Routes/userRoute"));
app.use("/api/chats", require("./Routes/chatRoute"));
app.use("/api/messages", require("./Routes/messageRoute"));

const port = process.env.PORT;

app.listen(port, '0.0.0.0', (req, res) => {
  console.log(`Running on ... ${port}`);
})

app.get("/", (req, res) => {
  res.send("Welcome our chat");
})



mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Mongo Success"))
  .catch(err => console.log(`Mongo Error ${err}`));