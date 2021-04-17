const { makeid, randomWord } = require("./utils");
var firstUserConnected = false;
var clientRooms = {};
var games = {};
var mainTimer;

//----------------------web Server----------------------
/*
const express = require("express");
const app = express();
const path = require("path");
const http = require('http');
const server = http.createServer(app);

app.use(express.static(path.join(__dirname + "/public/style.css")));
app.use(express.static(path.join(__dirname + "/public/app.js")));

app.set("port", process.env.PORT || 80);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.get("/public/style.css", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/style.css"));
});
app.get("/public/app.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/app.js"));
});

app.listen(app.get("port"), () => {
  console.log("listenin on port: ", app.get("port"));
});
*/
//----------------------Sockets Handling----------------------

//const io = require('socket.io')("https://app-comunicaciones2.herokuapp.com");
const io = require("socket.io")(process.env.PORT || 3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    withCredentials: false,
  },
});

io.on("connection", (client) => {
  console.log("usuario: " + client.id + " se ha conectado");
  if (!firstUserConnected) {
    //client.emit("allowToDraw", true);
    firstUserConnected = true;
  }
  client.emit("firstConnection", "te has conectado al servidor :)");
  client.on("confirm", (c) => {
    console.log(c);
  });

  client.on("message", (message) => {
    if (games[clientRooms[client.id]]) {
      var word = games[clientRooms[client.id]]["word"];
    } else {
      word = " ";
    }

    if (
      message
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase() != word
    ) {
      io.to(clientRooms[client.id]).emit("msg", {
        text: message,
        user: games[clientRooms[client.id]].users[client.id].username,
      });
    } else if (client.id != games[clientRooms[client.id]].drawer) {
      client.emit("hit", word);
      io.to(clientRooms[client.id]).emit(
        "point",
        games[clientRooms[client.id]].users[client.id].username
      );
      games[clientRooms[client.id]].users[client.id]["score"] += 1;
      if (games[clientRooms[client.id]].users[client.id]["score"] >= 5) {
        games[clientRooms[client.id]]["winner"] = client.id;

        io.to(clientRooms[client.id]).emit(
          "endGame",
          games[clientRooms[client.id]].users[client.id].username + " ha ganado"
        );
        clearTimeout(mainTimer);
      }
      io.to(clientRooms[client.id]).emit("usersChange", {
        users: games[clientRooms[client.id]].users,
      });
    }
  });

  client.on("newGame", (game) => {
    gameId = makeid(4);
    clientRooms[client.id] = gameId;
    var newGame = { password: game.password, users: {} };
    newGame.users[client.id] = { username: game.user, score: 0 };
    games[gameId] = newGame;
    client.join(gameId);
    client.number = 1;
    client.emit("gameCreated", { gameId: gameId, number: 1 });
    console.log(games);
  });

  client.on("joinGame", (game) => {
    gameId = game.gameId;
    const room = io.sockets.adapter.rooms.get(gameId);

    let numClients = 0;
    if (room) {
      numClients = room.size;
    }

    if (io.sockets.adapter.rooms.get(gameId) === undefined) {
      client.emit("noJoined");
      console.log("intento de ingreso a sala inexistente");
      return;
    }

    if (games[gameId].password == game.password) {
      games[gameId].users[client.id] = { username: game.user, score: 0 };
      clientRooms[client.id] = gameId;
      client.join(gameId);
      client.number = numClients + 1;
      client.emit("joined", {
        gameId: gameId,
        number: numClients + 1,
        running: games[gameId]["running"],
      });
      io.to(gameId).emit("usersChange", {
        users: games[gameId].users,
        userConnected: games[gameId].users[client.id].username,
      });
      console.log(games);
    } else {
      client.emit("noJoined");
      console.log("intento de ingreso con contraseña incorrecta");
    }
  });

  client.on("startGame", () => {
    room = clientRooms[client.id];
    users = Array.from(io.sockets.adapter.rooms.get(room));
    games[room]["winner"] = undefined;
    runGame(room, 0);
  });

  client.on("drawLine", (line) => {
    io.to(clientRooms[client.id]).emit("drawLineSocket", line);
  });
  client.on("drawSquare", (square) => {
    io.to(clientRooms[client.id]).emit("drawSquareSocket", square);
  });
  client.on("drawCircle", (circle) => {
    io.to(clientRooms[client.id]).emit("drawCircleSocket", circle);
  });
  client.on("clear", () => {
    io.to(clientRooms[client.id]).emit("clearSocket");
  });

  client.on("disconnect", () => {
    console.log("usuario: " + client.id + "se ha desconectado");
    console.log(
      "deleting user" + client.id + " from room: " + clientRooms[client.id]
    );

    console.log(io.sockets.adapter.rooms.get(clientRooms[client.id]));
    if (games[clientRooms[client.id]]) {
      userName = games[clientRooms[client.id]].users[client.id]["username"];
      delete games[clientRooms[client.id]].users[client.id];
      io.to(clientRooms[client.id]).emit("usersChange", {
        users: games[clientRooms[client.id]].users,
        userDisconnected: userName,
      });
    } else {
      return;
    }

    if (
      games[clientRooms[client.id]] &&
      Object.keys(games[clientRooms[client.id]].users).length == 0
    ) {
      console.log("deleting game", games[clientRooms[client.id]]);
      delete games[clientRooms[client.id]];
    }

    delete clientRooms[client.id];
    console.log("games ", games);
  });

  function runGame(room, i) {
    try {
      var users = Array.from(io.sockets.adapter.rooms.get(room));
    } catch (error) {
      return;
    }
    var users = Array.from(io.sockets.adapter.rooms.get(room));
    var UsersNumber = users.length;
    if (UsersNumber == 1) {
    } else if (games[room].winner) {
      io.to(clientRooms[client.id]).emit(
        "endGame",
        games[room].users[games[room].winner] + " Ha ganado"
      );
      return;
    }
    games[clientRooms[client.id]]["running"] = true;
    if (i >= UsersNumber) {
      console.log("ronda terminada");
      runGame(room, 0);
    } else {
      io.to(room).emit("gameStarted");
      var wordToDraw = randomWord();
      games[room]["word"] = wordToDraw;
      io.to(users[i]).emit("wordToDraw", wordToDraw);
      games[room]["drawer"] = users[i];
      setTimeout(() => {
        io.to(users[i]).emit("allowToDraw");
        io.to(room).emit("timeStart");
        mainTimer = setTimeout(() => {
          io.to(users[i]).emit("drawingTimeOut");
          runGame(room, i + 1);
        }, 60000);
      }, 10000);
    }
  }
});
