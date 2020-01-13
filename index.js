const http = require("http");
const server = http.createServer();

const port = process.env.port || 8000;

server.on("request", (req, res) => {
  res.end(
    `Stop, stop stop! You're going to take someone's eye out. Besides, you're saying it wrong. It's Levi-o-sa, not Levio-sar.`
  );
});

server.listen(port, () => console.log("Server Started"));
