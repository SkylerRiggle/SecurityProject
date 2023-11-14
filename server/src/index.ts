import express from 'express';
import { Server } from "socket.io";
import cors from "cors";

/* Initialize a New Express Application */
const app = express();
app.use(cors());

/* Signal Application is Running On Localhost */
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* Setup Socket */
const io = new Server(server, {
  cors: { origin: "*" }
});
io.on("connection", (socket) => {
  console.log("Socket Connected");
});

/* Register Application Routes */
app.get("/connect", async (_req, res) => {
  res.send({ status: true });
})