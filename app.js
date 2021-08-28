const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");


//mongoose.connect helps to connect mongoDB url to pass any data
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//connection on and off method cn be used to check whtr link connected or not...
mongoose.connection.on("connected", () => {
  console.log("Database Connected");
});
mongoose.connection.off("error", (err) => {
  console.log("Error connecting to database", err);
});


//requiring(registering) models here
require("./models/user");
require("./models/post");
require("./models/user");


app.use(express.json()); //every thing shld be sent in json from the server 
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));


if(process.env.NODE_ENV=="production"){
  app.use(express.static('client/build'));
  const path = require('path');
  app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  });
}


app.listen(PORT, () => {
  console.log("Server started at", PORT);
});
