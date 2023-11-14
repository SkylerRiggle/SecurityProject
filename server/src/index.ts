import express from 'express';
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

/* Initialize a New Express Application */
const app = express();
app.use(cors());

const server = new http.Server(app);
const io = new Server(server);
const port = process.env.PORT || 3333;

/* Signal Application is Running On Localhost */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  console.log("Socket Connected");
});

/* Register Application Routes */
app.get("/connect", async (_req, res) => {
  res.send({ status: true });
})