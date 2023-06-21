// Configurar Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4HR_DKdj4NKNxdfYOhstveEDbpfFiRD4",
  authDomain: "onlinepinball-349d0.firebaseapp.com",
  databaseURL: "https://onlinepinball-349d0-default-rtdb.firebaseio.com",
  projectId: "onlinepinball-349d0",
  storageBucket: "onlinepinball-349d0.appspot.com",
  messagingSenderId: "361547834474",
  appId: "1:361547834474:web:3d4d9b41b42aab541a5613"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referencia al nodo de jugadores en la base de datos
const playersRef = database.ref("players");

// Suscripción a cambios en los jugadores
playersRef.on("value", (snapshot) => {
  const players = snapshot.val();
  // Actualizar la lista de jugadores en la interfaz de usuario
  updatePlayersList(players);
});

// Función para actualizar la lista de jugadores en la interfaz de usuario
function updatePlayersList(players) {
  const playersListDiv = document.getElementById("players-list");
  playersListDiv.innerHTML = "";

  for (const playerId in players) {
    const player = players[playerId];
    const playerName = player.name;
    const playerScore = player.score;

    const playerDiv = document.createElement("div");
    playerDiv.innerText = playerName + ": " + playerScore;

    playersListDiv.appendChild(playerDiv);
  }
}

// Lógica del juego de pinball
const pinballCanvas = document.getElementById("pinball-canvas");
const ctx = pinballCanvas.getContext("2d");

let ballX = pinballCanvas.width / 2;
let ballY = pinballCanvas.height - 30;
let ballDX = 2;
let ballDY = -2;
const ballRadius = 10;

let playerScore = 0; // Puntaje del jugador

// Objeto que otorga puntos
const object = {
  x: pinballCanvas.width / 2,
  y: pinballCanvas.height / 2,
  radius: 20,
};

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawObject() {
  ctx.beginPath();
  ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function moveBall() {
  ballX += ballDX;
  ballY += ballDY;

  if (ballX + ballDX > pinballCanvas.width - ballRadius || ballX + ballDX < ballRadius) {
    ballDX = -ballDX;
  }

  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  } else if (ballY + ballDY > pinballCanvas.height - ballRadius) {
    // El jugador perdió, aquí puedes agregar la lógica correspondiente.
  }

  // Colisión con el objeto que otorga puntos
  if (ballX > object.x - object.radius &&
      ballX < object.x + object.radius &&
      ballY > object.y - object.radius &&
      ballY < object.y + object.radius) {
    playerScore += 5; // Aumentar el puntaje del jugador
    object.x = Math.random() * pinballCanvas.width; // Cambiar la posición del objeto
    object.y = Math.random() * pinballCanvas.height;
  }

  drawBall();
  drawObject();
}

function draw() {
  ctx.clearRect(0, 0, pinballCanvas.width, pinballCanvas.height);

  // Añade aquí el dibujo de otros elementos del juego, como los bumpers.

  moveBall();

  requestAnimationFrame(draw);
}

draw();
