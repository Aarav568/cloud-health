var mongoose = require("mongoose");
var passPortLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
   username: {type: String, lowercase: true},
   password: String,
   name: String,
   blood: {type: String, sparse: true},
   contact: Number,
   description: {type: String, sparse: true},
   email: String,
   qualification: {type: String, sparse: true},
   exp: {type: String, sparse: true},
   appointments: [{
      _id :  {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Appointment"
      }
   }]
});

userSchema.plugin(passPortLocalMongoose);

module.exports = mongoose.model("User", userSchema);



