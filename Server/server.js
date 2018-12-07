let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let cors = require("cors");
let SuperLogin = require("superlogin");
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
let FacebookStrategy = require('passport-facebook');

let app = express();
app.set("port", process.env.PORT || 3000);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let config = {
    dbServer: {
        protocol: "http://",
        host: "localhost:5984",
        user: "admin",
        password: "admin",
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
                clientID: "111111111111111111111111111111111111111111",
                clientSecret: "22222222222222222222222222222222222"
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

app.listen(app.get("port"));
console.log("App listening on " + app.get("port"));