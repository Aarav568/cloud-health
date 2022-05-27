var mongoose = require("mongoose");

var appointmentSchema = new mongoose.Schema({
    time: String,
    subject: String,
});


module.exports = mongoose.model("Appointment", appointmentSchema);



