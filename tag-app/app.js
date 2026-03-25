// Database references
const playersRef = db.ref("players");
const currentItRef = db.ref("currentIt");

// UI elements
const nameInput = document.getElementById("playerName");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const tagSelect = document.getElementById("tagSelect");
const tagBtn = document.getElementById("tagBtn");
const currentItDisplay = document.getElementById("currentIt");
const leaderboardList = document.getElementById("leaderboard");
// New UI elements
const yourNameInput = document.getElementById("yourName");
const setNameBtn = document.getElementById("setNameBtn");
const statusMessage = document.getElementById("statusMessage");

let yourName = "";
setNameBtn.onclick = () => {
  yourName = yourNameInput.value.trim();
  yourNameInput.value = "";
};


// Add player
addPlayerBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return;

  playersRef.child(name).set({
    tagsGiven: 0,
    tagsReceived: 0
  });

  nameInput.value = "";
};

// Listen for players
playersRef.on("value", snapshot => {
  const players = snapshot.val() || {};

  // Update dropdown
  tagSelect.innerHTML = "";
  Object.keys(players).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    tagSelect.appendChild(option);
  });

  // Update leaderboard
  leaderboardList.innerHTML = "";
  Object.entries(players)
    .sort((a, b) => b[1].tagsGiven - a[1].tagsGiven)
    .forEach(([name, stats]) => {
      const li = document.createElement("li");
      li.textContent = `${name} — Tags Given: ${stats.tagsGiven}, Tagged: ${stats.tagsReceived}`;
      leaderboardList.appendChild(li);
    });
});

currentItRef.on("value", snapshot => {
  const it = snapshot.val();
  currentItDisplay.textContent = it || "Nobody yet";

  if (!yourName) {
    statusMessage.textContent = "Set your name above!";
    return;
  }

  if (!it) {
    statusMessage.textContent = "Waiting for someone to be it...";
  } else if (it === yourName) {
    statusMessage.textContent = "Get out there and tag people!";
  } else {
    statusMessage.textContent = "Run!";
  }
});


// Tag button
tagBtn.onclick = () => {
  const tagged = tagSelect.value;
  if (!tagged) return;

  // Update "it"
  currentItRef.set(tagged);

  // Update stats
  playersRef.child(tagged).child("tagsReceived").transaction(n => (n || 0) + 1);

  // Whoever was previously it gets a "tag given"
  currentItRef.once("value", snap => {
    const previousIt = snap.val();
    if (previousIt && previousIt !== tagged) {
      playersRef.child(previousIt).child("tagsGiven").transaction(n => (n || 0) + 1);
    }
  });
};
