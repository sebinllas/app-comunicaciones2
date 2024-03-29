var gameId;
var gameScreen = document.getElementById("game");
var gameSelect = document.getElementById("gameSelect");
var displayGameId = document.getElementById("displayGameId");
var messagesArea = document.getElementById("messagesArea");
var usersArea = document.getElementById("usersArea");
var wordView = document.getElementById("wordToDrawView");
var startGameBtn = document.getElementById("startGameBtn");
var timerview = document.getElementById("timer");
var UserChangeAlert = document.createElement("div");
var clearButton = document.getElementById("clear");
var squareButton = document.getElementById("square");
var circleButton = document.getElementById("circle");
var eraseButton = document.getElementById("eraser");
var colorInput = document.getElementById("color");
var x = 0;
var y = 0;
var yourTurn = true;
var drawingLine = false;
var drawingSquare = false;
var drawingCircle = false;
var erasing = false;
var color = "black";
var strokewidth = 4;
var hit = false;
var hitWord;
var alertAudio = new Audio("./assets/beep.mp3");
var msgAudio = new Audio("./assets/msg-beep.mp3");
msgAudio.volume = 0.2;
alertAudio.volume = 0.5;
var mainInterval;

var canvas = document.getElementById("canvas");
canvas.setAttribute("width", 550);
canvas.setAttribute("height", 400);
var ctx = canvas.getContext("2d");

//----------------------Socket Handling----------------------

const socket = io("https://app-comunicaciones2.herokuapp.com/");

socket.on("firstConnection", (data) => {
  console.log(data);
  socket.emit("confirm", "he recivido el mensaje: " + data);
});

socket.on("msg", (message) => {
  var msgView = document.createElement("div");
  msgView.innerHTML = "<b>" + message.user + "</b>: " + message.text;
  messagesArea.appendChild(msgView);
  messagesArea.scrollTo(0, messagesArea.scrollHeight);
  msgAudio.play();
});

socket.on("gameCreated", (game) => {
  gameId = game.gameId;
  //displayGameId.innerHTML.replace("game id: "+gameId+"");
  displayGameId.textContent = "ID del juego: " + gameId;
  gameSelect.style.display = "none";
  gameScreen.style.display = "block";
});

socket.on("joined", (game) => {
  console.log("joined");
  displayGameId.textContent = "ID del juego: " + game.gameId;
  gameSelect.style.display = "none";
  gameScreen.style.display = "block";
  console.log("running = ", game["running"]);
  if (game.running) {
    startGameBtn.style.display = "none";
    wordView.innerHTML = "esperando siguiente ronda";
    yourTurn = false;
  }
});

socket.on("noJoined", () => {
  window.alert("gameId o contraseña incorrectos");
});

socket.on("usersChange", (usersChange) => {
  console.log(usersChange.users);
  usersArea.innerHTML = "";
  for (const key in Object.values(usersChange.users)) {
    var userView = document.createElement("li");
    userView.innerHTML =
      "<b>" +
      Object.values(usersChange.users)[key].username +
      ": </b>" +
      Object.values(usersChange.users)[key].score;
    usersArea.appendChild(userView);
    usersArea.appendChild(UserChangeAlert);
    if (usersChange.userDisconnected) {
      UserChangeAlert.innerHTML =
        "El Usuario " + usersChange.userDisconnected + " se ha desconectado";
    } else if (usersChange.userConnected) {
      UserChangeAlert.innerHTML =
        "El Usuario " + usersChange.userConnected + " se ha conectado";
    } else {
    }
    msgAudio.play();
    setTimeout(() => {
      UserChangeAlert.innerHTML = "";
    }, 4000);
  }
});

socket.on("gameStarted", () => {
  yourTurn = false;
  startGameBtn.style.display = "none";
});

socket.on("wordToDraw", (word) => {
  wordView.innerHTML = "Debes bibujar: " + word;
  canvas.width = canvas.width;
  var seconds = 10;
  var hitAlert = document.getElementById("hitAlert");
  var interval = setInterval(() => {
    hitAlert.innerHTML =
      "<h2>¡Preparate!<br/>debes dibujar la palabra: " +
      word +
      "</h2>Empezando en: " +
      seconds +
      " segundos";
    hitAlert.style.display = "flex";
    timerview.innerHTML = "podrás dibujar en: " + seconds + " segundos.";
    seconds--;
    if (seconds < 0) {
      timerview.innerHTML = "TIEMPO";
      clearInterval(interval);
      hitAlert.style.display = "none";
    }
  }, 1000);

  alertAudio.play();
});

socket.on("allowToDraw", () => {
  yourTurn = true;
  canvas.width = canvas.width;
});

socket.on("timeStart", () => {
  if (!yourTurn) {
    wordView.innerHTML = "PALABRA";
  }
  canvas.width = canvas.width;
  var seconds = 60;
  mainInterval = setInterval(() => {
    timerview.innerHTML = "tiempo restante: " + seconds + " segundos.";
    seconds--;
    if (seconds < 0) {
      clearInterval(mainInterval);
      timerview.innerHTML = "TIEMPO";
    }
  }, 1000);
});

socket.on("hit", (word) => {
  hit = true;
  hitWord = word;
  var hitAlert = document.getElementById("hitAlert");
  hitAlert.style.display = "flex";
  hitAlert.innerHTML =
    "<h2>¡felicitiones!<br/>Has acertado la palabra :)</h2>";
  setTimeout(() => {
    hitAlert.style.display = "none";
  }, 3000);
});

socket.on("point", (user) => {
  var msgView = document.createElement("div");
  msgView.innerHTML = "<b>" + user + " ha acertado la palabra</b>";
  messagesArea.appendChild(msgView);
  messagesArea.scrollTo(0, messagesArea.scrollHeight);
  alertAudio.play();
});

socket.on("endGame", (msg) => {
  var hitAlertText = document.getElementById("hitAlert").innerHTML;
  document.getElementById("hitAlert").innerHTML = msg;
  document.getElementById("hitAlert").style.display = "flex";
  setTimeout(() => {
    document.getElementById("hitAlert").style.display = "none";
  }, 5000);
  //document.getElementById("hitAlert").innerHTML = hitAlertText;
  clearInterval(mainInterval);
  startGameBtn.style.display = "block";
});

socket.on("drawLineSocket", (line) => {
  if (!yourTurn) {
    erasing = false;
    drawLine(line.x, line.y, line.x0, line.y0, line.color, line.strokeWidth);
  }
});

socket.on("drawSquareSocket", (square) => {
  if (!yourTurn) {
    erasing = false;
    drawSquare(
      square.x,
      square.y,
      square.w,
      square.h,
      square.color,
      square.strokeWidth
    );
  }
});

socket.on("drawCircleSocket", (circle) => {
  if (!yourTurn) {
    erasing = false;
    drawCircle(
      circle.x,
      circle.y,
      circle.w,
      circle.h,
      circle.color,
      circle.strokeWidth
    );
  }
});

socket.on("clearSocket", () => {
  if (!yourTurn) {
    canvas.width = canvas.width;
  }
});

socket.on("drawingTimeOut", () => {
  yourTurn = false;
  canvas.width = canvas.width;
  wordView.innerHTML = "PALABRA";
});

//----------------------Select Game functions----------------------

document.getElementById("newGameForm").addEventListener("submit", (e) => {
  e.preventDefault();
  newGame();
});

document.getElementById("joinGameForm").addEventListener("submit", (e) => {
  e.preventDefault();
  joinGame();
});

function newGame() {
  var userNameHost = document.getElementById("userNameHost").value;
  var newPassword = document.getElementById("newPassword").value;
  socket.emit("newGame", { user: userNameHost, password: newPassword });
}

function joinGame() {
  var gameId = document.getElementById("gameId").value;
  var userName = document.getElementById("userName").value;
  var password = document.getElementById("password").value;

  socket.emit("joinGame", {
    gameId: gameId,
    user: userName,
    password: password,
  });
}

//----------------------Game functionalities----------------------

document.getElementById("messageForm").addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  var message = document.getElementById("message").value;
  document.getElementById("message").value = "";
  if (
    hit &&
    message
      .normalize("NFD")
      .replace(/[\u00C0-\u00FF]/g, "")
      .toUpperCase() == hitWord
  ) {
    return;
  }
  socket.emit("message", message);
}

function changeColor(c) {
  color = c;
}
function changeStrokeWidth(s) {
  strokewidth = s;
}
clearButton.addEventListener("click", function () {
  if (yourTurn) {
    canvas.width = canvas.width;
    socket.emit("clear");
  }
});

function square() {
  if (drawingSquare) {
    drawingSquare = false;
    squareButton.style.background = "white";
  } else {
    drawingSquare = true;
    squareButton.style.background = "#282846";
    drawingCircle = false;
    circleButton.style.background = "white";
    erasing = false;
    eraseButton.style.background = "white";
  }
}

function circle() {
  if (drawingCircle) {
    drawingCircle = false;
    circleButton.style.background = "white";
  } else {
    drawingSquare = false;
    squareButton.style.background = "white";
    drawingCircle = true;
    circleButton.style.background = "#282846";
    erasing = false;
    eraseButton.style.background = "white";
  }
}

function erase() {
  if (erasing) {
    erasing = false;
    eraseButton.style.background = "white";
  } else {
    drawingSquare = false;
    squareButton.style.background = "white";
    drawingCircle = false;
    circleButton.style.background = "white";
    erasing = true;
    eraseButton.style.background = "#282846";
  }
}

function startGame() {
  socket.emit("startGame");
}

canvas.addEventListener("mousedown", function (event) {
  if (yourTurn) {
    x = event.clientX - canvas.offsetLeft + window.scrollX;
    y = event.clientY - canvas.offsetTop + window.scrollY;
    if (!drawingSquare && !drawingCircle) {
      drawingLine = true;
    }
  }
});

canvas.addEventListener("mousemove", function (event) {
  if (drawingLine & yourTurn) {
    newX = event.clientX - canvas.offsetLeft + window.scrollX;
    newY = event.clientY - canvas.offsetTop + window.scrollY;
    drawLine(x, y, newX, newY, color, strokewidth);
    y = newY;
    x = newX;
  }
});

canvas.addEventListener("mouseup", function (event) {
  if (yourTurn) {
    if (drawingSquare) {
      newX = event.clientX - canvas.offsetLeft + window.scrollX;
      newY = event.clientY - canvas.offsetTop + window.scrollY;
      drawSquare(x, y, newX - x, newY - y, color, strokewidth);
    } else if (drawingCircle) {
      newX = event.clientX - canvas.offsetLeft + window.scrollX;
      newY = event.clientY - canvas.offsetTop + window.scrollY;
      drawCircle(x, y, newX - x, newY - y, color, strokewidth);
    } else if (drawingLine) {
      newX = event.clientX - canvas.offsetLeft + window.scrollX;
      newY = event.clientY - canvas.offsetTop + window.scrollY;
      drawLine(x, y, newX, newY, color, strokewidth);
      drawingLine = false;
    }
  }
});
canvas.addEventListener("mouseout", function (event) {
  if (drawingLine) {
    newX = event.clientX - canvas.offsetLeft + window.scrollX;
    newY = event.clientY - canvas.offsetTop + window.scrollY;
    drawLine(x, y, newX, newY, color, strokewidth);
    drawingLine = false;
  }
});

function drawLine(x, y, x0, y0, color, stroke) {
  ctx.beginPath();
  var lineColor, s;
  if (erasing) {
    lineColor = "white";
    s = stroke * 3;
  } else {
    lineColor = color;
    s = stroke;
  }
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = s;
  ctx.moveTo(x, y);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineTo(x0, y0);
  ctx.stroke();
  ctx.closePath();
  if (yourTurn) {
    socket.emit("drawLine", {
      color: lineColor,
      strokeWidth: s,
      x: x,
      y: y,
      x0: x0,
      y0: y0,
    });
  }
}

function drawSquare(x, y, w, h, color, stroke) {
  ctx.strokeStyle = color;
  ctx.lineWidth = stroke;
  ctx.strokeRect(x, y, w, h);
  if (yourTurn) {
    socket.emit("drawSquare", {
      color: color,
      strokeWidth: stroke,
      x: x,
      y: y,
      w: newX - x,
      h: newY - y,
    });
  }
}

function drawCircle(x, y, w, h, color, stroke) {
  var kappa = 0.5522847498;
  var ox = (w / 2) * kappa; // desplasamiento horizontal (offset)
  var oy = (h / 2) * kappa; // desplazamiento vertical (offset)
  var xf = x + w; // x final
  var yf = y + h; // y final
  var xm = x + w / 2; // x medio
  var ym = y + h / 2; // y medio

  ctx.beginPath();
  ctx.lineWidth = stroke;
  ctx.strokeStyle = color;

  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xf, ym - oy, xf, ym);
  ctx.bezierCurveTo(xf, ym + oy, xm + ox, yf, xm, yf);
  ctx.bezierCurveTo(xm - ox, yf, x, ym + oy, x, ym);
  ctx.closePath();
  ctx.stroke();
  if (yourTurn) {
    socket.emit("drawCircle", {
      color: color,
      strokeWidth: stroke,
      x: x,
      y: y,
      w: newX - x,
      h: newY - y,
    });
  }
}
