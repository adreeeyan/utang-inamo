let fs = require("fs");
let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let cors = require("cors");
let path = require("path");
let SuperLogin = require("superlogin");
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
let GoogleTokenStrategy = require("passport-google-token").Strategy;
let FacebookStrategy = require("passport-facebook");

let app = express();
app.set("port", process.env.PORT || 3000);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let htmlDir = path.join(__dirname, "../UI/www");
if (!fs.existsSync(htmlDir)) {
    htmlDir = path.join(__dirname, "UI/www");
}

app.use(express.static(htmlDir));
app.use(cors());

app.use((req, res, next) => {
    var allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
        "herokuapp",
        "github"
    ];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, DELETE, POST, PUT, OPTIONS");
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
        whitelist: ["image"]
    }
}

// Initialize SuperLogin
let superlogin = new SuperLogin(config);
superlogin.registerOAuth2("google", GoogleStrategy);
superlogin.registerTokenProvider("google", GoogleTokenStrategy);
superlogin.registerOAuth2("facebook", FacebookStrategy);

// Mount SuperLogin"s routes to our app
app.use("/auth", superlogin.router);

// Add additional fields for the user
superlogin.onCreate(function (userDoc, provider) {
    if (userDoc.profile === undefined) {
        userDoc.profile = {};
    }
    if (provider !== "local") {
        try {
            const prof = userDoc[provider].profile;
            const image = prof._json.picture || prof.photos[0].value;
            if (image) {
                // remove the sz query
                const cleanUrl = image.replace(/\?sz=\d+/g, "");
                userDoc.profile.image = cleanUrl;
            }
        } catch (e) {
            console.log("I cannot retrieve the picture :(", e);
        }

    }
    return Promise.resolve(userDoc);
});

app.put("/change-image/:id", async function (req, res) {
    console.log("userDb", superlogin.userDB);
    const user = await superlogin.getUser(req.params.id);
    user.profile.image = req.body.image;
    await superlogin.userDB.put(user);
    res.json({ status: "ok" });
});

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