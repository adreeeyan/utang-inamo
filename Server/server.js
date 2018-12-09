let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let cors = require("cors");
let path = require("path");
let SuperLogin = require("superlogin");
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
let FacebookStrategy = require("passport-facebook");

let app = express();
app.set("port", process.env.PORT || 3000);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../UI/www")));
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let config = {
    dbServer: {
        protocol: process.env.DB_HOST ? "https://" : "http://",
        host: process.env.DB_HOST || "localhost:5984",
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        // automatically detect if the host is Cloudant
        cloudant: process.env.DB_HOST && process.env.DB_HOST.search(/\.cloudant\.com$/) > -1,
        userDB: "sl-users",
        couchAuthDB: "_users"
    },
    mailer: {
        fromEmail: "gmail.user@gmail.com",
        options: {
            service: "Gmail",
            auth: {
                user: "gmail.user@gmail.com",
                pass: "userpass"
            }
        }
    },
    security: {
        maxFailedLogins: 3,
        lockoutTime: 600,
        tokenLife: 86400,
        loginOnRegistration: true,
    },
    userDBs: {
        defaultDBs: {
            private: ["utanginamo"]
        },
        model: {
            utanginamo: {
                permissions: ["_reader", "_writer", "_replicator"]
            }
        }
    },
    providers: {
        local: true,
        facebook: {
            credentials: {
                clientID: "111111111111111111111",
                clientSecret: "11111111111111111"
            },
            options: {
                scope: ["email"]
            }
        },
        google: {
            credentials: {
                clientID: "113008889190-2ld9cfnl4l7j2tkuq3hi5b72ef77qnj3.apps.googleusercontent.com",
                clientSecret: "TwhtTnYJVw87HWUOJk8ic5k0"
            },
            options: {
                scope: ["profile", "email"]
            }
        }
    }
}

// Initialize SuperLogin
let superlogin = new SuperLogin(config);
superlogin.registerOAuth2("google", GoogleStrategy);
superlogin.registerOAuth2("facebook", FacebookStrategy);

// Mount SuperLogin"s routes to our app
app.use("/auth", superlogin.router);


app.use("*", function (req, res) {
    res.sendFile("index.html", { root: path.join(__dirname, "../UI/www") });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

app.listen(app.get("port"));
console.log("App listening on " + app.get("port"));