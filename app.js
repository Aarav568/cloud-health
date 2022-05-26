/*----------------------------------------Initialization----------------------------- */
const   express             = require("express"),
        app                 = express(),
        bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"),
        passport            = require("passport"),
        LocalStrategy       = require("passport-local"),
        User                = require("./models/user.js")

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
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")


/*-------------------------------------Routes---------------------------------- */

/*------------------------GET----------------------------- */

app.get("/logo", (req, res) => {
    res.render("logo")
})
app.get("/history", (req, res) => {
    res.render("history")
})
app.get("/call", (req, res) => {
    res.render("call")
})
app.get("/feedback", (req, res) => {
    res.render("feedback")
})
app.get("/issue", (req, res) => {
    res.render("issue")
})
app.get("/medical", (req, res) => {
    res.render("medical")
})
app.get("/appointment", (req, res) => {
    res.render("appointment")
})

app.get("/account",function(req, res ) {
    console.log("in")
    User.findById(req.user._id, (err, doc) => {
        if(err){
            console.log(err)
        }
        res.render("account", {data: doc})
    })

})

app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/dash", (req, res) => {
    res.render("dash")
})

app.get("/service", (req, res) => {
    res.render("service")
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

app.get("/home", (req, res) => {
    res.render("home")
})

app.get("/logout", (req, res)=>{
    req.logout((err) => {
        if(err) {
            console.log(err)
        }
        res.redirect("/")
    })
})

app.get("/login", (req, res) => {
    res.render("/login")
})

/*------------------------POST----------------------------- */

app.post("/register", (req, res) => {
    var name = req.body.name
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
         return res.redirect("/register")
       }
       passport.authenticate("local")(req, res, function(){
         res.render("details", {user: req.user})
       });
    });    
})

app.post("/login", passport.authenticate("local", 
{
  successRedirect: "/home",
  failureRedirect: "/login"
}), function(req, res){
});

app.post("/details", (req, res) =>{
    User.findByIdAndUpdate(req.user._id, { $set: {
        name: req.body.name,
        email: req.body.email,
        blood: req.body.blood,
        contact: req.body.contact,
        description: req.body.description
    }
    }, (err, doc) => {
        if(err){
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