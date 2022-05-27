/*----------------------------------------Initialization----------------------------- */
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    multer = require("multer"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user.js"),
    Appointment = require("./models/appointment.js"),
    upload = multer({ dest: "uploads/" })

/*-------------------------------------Passport Set-Up---------------------------------- */
app.use(express.static(__dirname + '/public'));
app.use(require("express-session")({
    secret: "Damn",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ------------------------------------Server Setup ---------------------------------- */
mongoose.connect("mongodb+srv://admin:admin@hackathon.y7ydg.mongodb.net/?retryWrites=true&w=majority")
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

/*-------------------------------------Routes---------------------------------- */

/*------------------------GET----------------------------- */

app.get("/call", isLoggedIn, (req, res) => {
    if (req.user.username.includes("@cloudhealth.com")) {
        res.render("aptDoctor")
    } else {
        User.find(
            { "username": /@cloudhealth.com/i },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                res.render("call", { doctors: docs })
            }
        );
    }
})
app.get("/issue", isLoggedIn, (req, res) => {
    res.render("issue")
})
app.get("/medical", isLoggedIn, (req, res) => {
    res.render("medical")
})
app.get("/appointment", isLoggedIn, (req, res) => {
    if (req.user.username.includes("@cloudhealth.com")) {
        res.render("aptDoctor")
    } else {
        User.find(
            { "username": /@cloudhealth.com/i },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                res.render("aptUser", { doctors: docs })
            }
        );
    }
})

app.get("/my-appointments", isLoggedIn, (req, res) => {
    User.findById(req.user._id).populate("appointments._id").exec((err, doctor) => {
        if (err) { console.log(err) }
        var apts = []
        var waiting = 0
        doctor.appointments.forEach((e, index, array) => {
            User.findOne({ "username": { $not: /@cloudhealth.com/i }, appointments: { $elemMatch: { _id: e._id } } }, (err, user) => {
                if (err) { console.log(err) }
                apts.push({
                    time: e._id.time,
                    subject: e._id.subject,
                    patient: user.name
                })
                waiting++;
                if (waiting === array.length) {
                    res.render("aptDoctor", { appointments: apts })
                }
            })
        })
    })
})

app.get("/prescribe", (req, res) => {
    res.render("documents")
})

app.get("/view-appointments", isLoggedIn, (req, res) => {
    User.findById(req.user._id).populate("appointments._id").exec((err, user) => {
        if (err) { console.log(err) }
        var apts = []
        var waiting = 0
        user.appointments.forEach((e, index, array) => {
            User.findOne({ "username": /@cloudhealth.com/i, appointments: { $elemMatch: { _id: e._id } } }, (err, doctor) => {
                if (err) { console.log(err) }
                apts.push({
                    time: e._id.time,
                    subject: e._id.subject,
                    doctor: doctor.name
                })
                console.log(apts, "pushed new")
                waiting++;
                if (waiting === array.length) {
                    console.log(apts, "before render")
                    res.render("view-appointments", { appointments: apts })
                }
            })
        })
    })
})

app.get("/registerdoctor", (req, res) => {
    res.render("register", { user: "doctor" })
})
app.get("/account", isLoggedIn, function (req, res) {
    User.findById(req.user._id, (err, doc) => {
        if (err) {
            console.log(err)
        }
        res.render("account", { data: doc })
    })

})

app.get("/documents", isLoggedIn, (req, res) => {
    res.render("documents")
})

app.get("/feedback", isLoggedIn, (req, res) => {
    res.render("feedback")
})

app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/service", (req, res) => {
    res.render("service")
})

app.get("/issue", isLoggedIn, (req, res) => {
    res.render("issue")
})

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/details", isLoggedIn, (req, res) => {
    res.render("details")
})

app.get("/medical-history", isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err)
        }
        res.render("medicalHistory", { documents: user.documents })
    })
})
app.get("/patient-history", isLoggedIn, (req, res) => {
    res.render("patientHistory")
})

app.get("/home", isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, doc) => {
        if (err) {
            console.log(err)
        }
        if (doc.username.includes("@cloudhealth.com")) {
            res.render("home")
        } else {
            res.render("home")
        }
    })
})

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err)
        }
        res.redirect("/")
    })
})

app.get('*', function (req, res) {
    res.redirect("/")
});

app.get("/login", (req, res) => {
    res.render("/login")
})

/*------------------------POST----------------------------- */

app.post("/appointment", isLoggedIn, (req, res) => {
    User.findById(req.body.doctorName, (err, doc) => {
        if (err) {
            console.log(err)
        }
        res.render("book", { doctor: doc })
    })
})

app.post("/register", (req, res) => {
    if (req.body.doc) {
        var name = `${req.body.username}@cloudhealth.com`
    } else {
        var name = req.body.username
    }
    var newUser = new User({ username: name });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            res.redirect("/register")
        }
        req.login(user, (err) => {
            if (err) { console.log(err) }
            res.redirect("/details")
        })
    });
})

app.post("/call", (req, res) => {

    var call = {
        time: new Date(),
        patient: req.user.name
    }
    User.findById(req.body.doctorName, (err, doctor) => {
        if (err) { console.log(err) }
        doctor.calls.push(call)
        doctor.save((err)=> {
            if(err){console.log(err)}
            res.render("calling", {doctor: doctor})
        })
    })
})

app.post("/documents", upload.single("file"), (req, res) => {
    var today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    today = dd + '/' + mm + '/' + yyyy;
    User.findById(req.user._id, (err, user) => {
        user.documents.push({
            filename: req.body.name,
            fileType: req.file.mimetype,
            size: req.file.size / 1000 + "  kb",
            date: today
        })
        user.save()
        res.redirect("/medical-history")
    })
})

app.post("/read", (req, res) => {
    // User.findById(req.user._id, (err, doctor) => {

    // })
})

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/home",
        failureRedirect: "/login"
    }), function (req, res) {
    });

app.post("/book", isLoggedIn, (req, res) => {
    Appointment.create({
        time: req.body.date,
        subject: req.body.subject,
        address: ""
    }, (err, doc) => {
        if (err) {
            console.log(err)
        }
        User.findById(req.user._id, (err, user) => {
            if (err) { console.log(err) }
            user.appointments.push(doc)
            user.save()
            User.findById(req.body.doctor, (err, doctor) => {
                if (err) { console.log(err) }
                doctor.appointments.push(doc)
                doctor.save((err) => {
                    if (err) { console.log(err) }
                    res.redirect("/home")
                })
            })
        })
    })
})

app.post("/details", isLoggedIn, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            blood: req.body.blood,
            contact: req.body.contact,
            description: req.body.description,
            qualification: req.body.qualifications,
            exp: req.body.experience
        }
    }, (err, doc) => {
        if (err) {
            console.log(err)
        }
        res.redirect("/home")
    })
})

/*-------------------------------------Routes END---------------------------------- */

/*-------------------------------------Server Int--------------------------------- */
app.listen("3000", () => {
    console.log("server started")
})