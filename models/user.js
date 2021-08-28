const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;


//this is a schema file inside modules folder... [User schema]
//this will create new schema in mongodb using mongoose tools, with required fields...
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requied: true,
  },
  email: {
    type: String,
    requied: true,
  },
  password: {
    type: String,
    requied: true,
  },
  resetToken:String,
  expireToken:Date,
  pic:{
    type:String,
    default:"https://res.cloudinary.com/gjcloud/image/upload/v1629180732/no-image-icon-hi-1_s9zlc0.png"
  }
});

mongoose.model("User", userSchema);
