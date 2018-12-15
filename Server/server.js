let fs = require("fs");
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

let htmlDir = path.join(__dirname, "../UI/www");
if(!fs.existsSync(htmlDir)){
    htmlDir = path.join(__dirname, "UI/www");
}

app.use(express.static(htmlDir));
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let config = {
    dbServer: {
        protocol: process.env.HTTP_PROTOCOL || "http://",
        host: process.env.DB_HOST || "192.168.254.19:5984",
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        // automatically detect if the host is Cloudant
        cloudant: process.env.DB_HOST && process.env.DB_HOST.search(/\.cloudant\.com$/) > -1,
        userDB: "utanginamo-users",
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
                clientID: process.env.FACEBOOK_CLIENTID,
                clientSecret: process.env.FACEBOOK_CLIENTSECRET
            },
            options: {
                scope: ["email"]
            }
        },
        google: {
            credentials: {
                clientID: process.env.GOOGLE_CLIENTID,
                clientSecret: process.env.GOOGLE_CLIENTSECRET
            },
            options: {
                scope: ["profile", "email"]
            }
        }
    },
    userModel: {
        whitelist: ["picture"]
    }
}

// Initialize SuperLogin
let superlogin = new SuperLogin(config);
superlogin.registerOAuth2("google", GoogleStrategy);
superlogin.registerOAuth2("facebook", FacebookStrategy);

// Mount SuperLogin"s routes to our app
app.use("/auth", superlogin.router);

// Add additional fields for the user
superlogin.onCreate(function (userDoc, provider) {
    if (userDoc.profile === undefined) {
        userDoc.profile = {};
    }
    if (provider !== "local") {
        const image = userDoc[provider].profile.photos[0].value;
        if (image) {
            // remove the sz query
            const cleanUrl = image.replace(/\?sz=\d+/g, "");
            userDoc.profile.image = cleanUrl;
        }
    }
    return Promise.resolve(userDoc);
})


app.use("*", function (req, res) {
    res.sendFile("index.html", { root: htmlDir });
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
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = app.get("port");
}

app.listen(port);
console.log("App listening on " + port);