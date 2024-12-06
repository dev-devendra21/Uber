import http from "http";
import app from "./index.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(3000, () => {
    console.log(`Server running on port http://localhost:${port} `);
});