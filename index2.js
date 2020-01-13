const http = require("http");
const fs = require("fs");
const server = http.createServer();

const port = process.env.PORT || 8000;

server.on("request", (req, res) => {
  let chunk;
  if (req.url.indexOf("?password=") > -1) {
    const password = req.url.substring(req.url.indexOf("?password=") + 10);
    console.log("url", req.url.indexOf("?password="), req.url);
    console.log("pwd", password);

    checkPwd(password).then(check => {
      // let check = null;
      console.log("Password check: ", check);
      if (check) {
        chunk = `<h3>Yuppppiieeee!! Right Password!</h3><p>${password}</p><a href="/index.html">Home</a>`;
      } else {
        chunk = `<h3>Bad bad bad bad password... :-(</h3><p>${password}</p><a href="/index.html">Home</a>`;
      }
      res.writeHeader(200, { "Content-Type": "text/html" });
      res.write(chunk);
      res.end();
      chunk = null;
    });
  } else {
    switch (req.url) {
      case "/":
      case "/index.html":
        chunk = "index.html";
        break;
      case "/css/style.css":
      case "/link.html":
        chunk = req.url.substring(1);
        break;
      case "/givemesecret":
        const password =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15) +
          "\n";
        fs.appendFile("passwords.txt", password, err => {
          if (err) console.log("the error is!!!! ", err);
          chunk = `<h3>Your new Password is:</h3><p>${password}</p><a href="/index.html">Go Home</a>`;
          res.writeHeader(200, { "Content-Type": "text/html" });
          res.write(chunk);
          res.end();
          chunk = null;
        });
        break;
      default:
        chunk = "404.html";
    }
  }
  if (chunk !== null && chunk !== undefined) {
    let src = fs.createReadStream(chunk);
    src.pipe(res);
  }
});

server.listen(port, () => console.log("Server Started"));

function checkPwd(pwd) {
  return new Promise((resolve, reject) => {
    fs.readFile("passwords.txt", "utf-8", (err, data) => {
      if (data.indexOf("\n") > 0) {
        let arr = [];
        while (data.length) {
          const dataPwd = data.substring(0, data.indexOf("\n"));
          //   console.log("temp password: ", dataPwd, pwd);
          if (dataPwd === pwd) {
            console.log("Password found");
            return resolve(true);
          }
          data = data.substring(dataPwd.length + 1, data.length);
          if (data.length <= 5) break;
        }
      }
      console.log("Password not found");
      return resolve(false);
    });
  });
}
