var express = require("express");
var request = require("request");
var app = express();

var appKey = "ltqyffujltxm03j";
var appSecret = "080fgizhwloho2a";
var redirectUri = "http://localhost:3000/callback";
let refreshToken = "";

app.get("/login", function (req, res) {
  var authUrl =
    "https://www.dropbox.com/oauth2/authorize" +
    "?response_type=code" +
    "&client_id=" +
    appKey +
    "&redirect_uri=" +
    redirectUri +
    "&token_access_type=offline"; // Request a refresh token

  res.redirect(authUrl);
});

app.get("/callback", function (req, res) {
  var authCode = req.query.code;

  request.post(
    "https://api.dropboxapi.com/oauth2/token",
    {
      form: {
        code: authCode,
        grant_type: "authorization_code",
        client_id: appKey,
        client_secret: appSecret,
        redirect_uri: redirectUri,
      },
    },
    function (error, response, body) {
      var data = JSON.parse(body);
      var accessToken = data.access_token;
      refreshToken = data.refresh_token;

      // Now you can use the access token and refresh token
      res.send(
        "Access token: " + accessToken + ", Refresh token: " + refreshToken
      );
    }
  );
});

app.get("/files", function (req, res) {
  // Use the refresh token to get a new access token
  request.post(
    "https://api.dropboxapi.com/oauth2/token",
    {
      form: {
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        client_id: appKey,
        client_secret: appSecret,
      },
    },
    function (error, response, body) {
      var accessToken = JSON.parse(body).access_token;

      // Use the new access token to get a list of all files and folders
      request.post(
        "https://api.dropboxapi.com/2/files/list_folder",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "",
            recursive: true,
          }),
        },
        function (error, response, body) {
          var files = JSON.parse(body).entries.map(function (entry) {
            return entry.path_display;
          });

          res.send("Files and folders: " + files.join(", "));
        }
      );
    }
  );
});

app.listen(3000);
