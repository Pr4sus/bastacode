function getCookie(name) {
  let decodedCookies = decodeURIComponent(document.cookie);
  let cookiesArray = decodedCookies.split(';');
  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim();
    if (cookie.indexOf(name + "=") == 0) {
      return cookie.substring(name.length + 1);
    }
  }
  return "";
}

function setCookie(name, value, days) {
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/";
}

window.onload = function() {
  displayHighScores();
};

function saveHighScore(score, username) {
  let highScores = JSON.parse(getCookie("highScores")) || [];
  highScores.push({ username: username, score: score });
  highScores = highScores.sort((a, b) => b.score - a.score).slice(0, 3);
  setCookie("highScores", JSON.stringify(highScores), 30);
  displayHighScores();
}

function displayHighScores() {
  let highScores = JSON.parse(getCookie("highScores")) || [];
  const scoreList = document.getElementById("score-list");
  scoreList.innerHTML = '';

  if (highScores.length === 0) {
    scoreList.innerHTML = '<li>No scores yet</li>';
    return;
  }

  highScores.forEach((entry, index) => {
    let listItem = document.createElement('li');
    listItem.textContent = `#${index + 1} - ${entry.username}: ${entry.score}`;
    scoreList.appendChild(listItem);
  });
}
