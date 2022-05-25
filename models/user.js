var mongoose = require("mongoose");
var passPortLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
   username: {type: String, lowercase: true},
   password: String,
   name: String,
   blood: String,
   contact: Number,
   description: String,
   email: String
});

userSchema.plugin(passPortLocalMongoose);

module.exports = mongoose.model("User", userSchema);



