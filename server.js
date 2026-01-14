import express from "express";

const server = express();

server.get("/", (requiere, response) => {
    responde.send("El servidor express respondio")
})

server.listen(8080, () => {
    log("el servidor express esta corriendo en el puerto 8080")
})
