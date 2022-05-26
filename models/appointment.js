var mongoose = require("mongoose");
var passPortLocalMongoose = require("passport-local-mongoose")

var appointmentSchema = new mongoose.Schema({
    time: Date,
    subject: String,
    doctor: String,
    patient: String,
    hospital: String
});

appointmentSchema.plugin(passPortLocalMongoose);

module.exports = mongoose.model("Appointment", appointmentSchema);



