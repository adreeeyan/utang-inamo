export const environment = {
    superlogin: {
        // An optional URL to API server, by default a current window location is used.
        serverUrl: "https://polar-ocean-92021.herokuapp.com",
        // The base URL for the SuperLogin routes with leading and trailing slashes (defaults to "/auth")
        baseUrl: "https://polar-ocean-92021.herokuapp.com/auth/",
        // Where to save your session token: localStorage ("local") or sessionStorage ("session"), default: "local"
        storage: "local",
        // The authentication providers that are supported by your SuperLogin host
        providers: ["google", "facebook"],
        // Sets when to check if the session is expired during the setup.
        // false by default.
        checkExpired: false,
        // A float that determines the percentage of a session duration, after which SuperLogin will automatically refresh the
        // token. For example if a token was issued at 1pm and expires at 2pm, and the threshold is 0.5, the token will
        // automatically refresh after 1:30pm. When authenticated, the token expiration is automatically checked on every
        // request. You can do this manually by calling superlogin.checkRefresh(). Default: 0.5
        refreshThreshold: 0.5,
    },
    webUrl: "https://adrianonrails.github.io/utang-inamo",
    appVersion: "0.0.1"
};