var mongoose = require("mongoose");
var passPortLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
   username: {type: String, lowercase: true},
   password: String,
   name: String,
   blood: String,
   contact: Number,
   description: String,
   email: String,
   qualification: String,
   exp: String,
   appointments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Appointment"
      }
   ]
});

userSchema.plugin(passPortLocalMongoose);

module.exports = mongoose.model("User", userSchema);



