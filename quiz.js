// Retrieve difficulty, topic, and username from cookies
let difficulty = getCookie("difficulty");
let topic = getCookie("topic");
let username = getCookie("username");

console.log("Difficulty: ", difficulty);
console.log("Topic: ", topic);

// If there's no difficulty or topic selected, redirect to the main page
if (!difficulty || !topic) {
  alert("No difficulty or topic selected. Please go back to the main page and select one.");
  window.location.href = "index.html";
}

let currentQuestionIndex = 0; // Keeps track of which question we're on
let score = 0; // Tracks the player's score
let timer; // To hold the timer for hard difficulty questions
let timeLeft = 60; // Timer countdown for hard questions (60 seconds)

const questionBank = {
  easy: {
    algebra: [
      { question: "What is 2 + 2?", answers: ["A) 3", "B) 4", "C) 5", "D) 6"], correctAnswer: 1 },
      { question: "What is 3 + 1?", answers: ["A) 2", "B) 3", "C) 4", "D) 5"], correctAnswer: 2 },
      { question: "What is 5 + 7?", answers: ["A) 12", "B) 13", "C) 14", "D) 15"], correctAnswer: 0 }
    ],
    geometry: [
      { question: "What is the sum of angles in a triangle?", answers: ["A) 180°", "B) 360°", "C) 90°", "D) 270°"], correctAnswer: 0 },
      { question: "What is the area of a square with side length 4?", answers: ["A) 8", "B) 12", "C) 16", "D) 20"], correctAnswer: 2 },
      { question: "What is the perimeter of a rectangle with length 6 and width 4?", answers: ["A) 20", "B) 24", "C) 30", "D) 12"], correctAnswer: 0 }
    ],
    statistics: [
      { question: "What is the mean of 2, 4, 6?", answers: ["A) 4", "B) 6", "C) 5", "D) 7"], correctAnswer: 0 },
      { question: "What is the mode of 1, 2, 2, 3?", answers: ["A) 1", "B) 2", "C) 3", "D) 4"], correctAnswer: 1 }
    ],
    theory: [
      { question: "What is the capital of France?", answers: ["A) Berlin", "B) Madrid", "C) Paris", "D) Rome"], correctAnswer: 2 },
      { question: "Who wrote 'Romeo and Juliet'?", answers: ["A) Shakespeare", "B) Dickens", "C) Chaucer", "D) Orwell"], correctAnswer: 0 }
    ],
    trigonometry: [
      { question: "What is sin(30°)?", answers: ["A) 0.5", "B) 0.7", "C) 1", "D) 0.3"], correctAnswer: 0 },
      { question: "What is cos(45°)?", answers: ["A) 0.5", "B) 0.707", "C) 1", "D) 0"], correctAnswer: 1 }
    ]
  },
  medium: {
    algebra: [
      { question: "What is 5 + 7?", answers: ["A) 10", "B) 11", "C) 12", "D) 13", "E) 14"], correctAnswer: 2 },
      { question: "What is 9 + 3?", answers: ["A) 9", "B) 10", "C) 11", "D) 12", "E) 13"], correctAnswer: 3 },
      { question: "What is 4 * 3?", answers: ["A) 10", "B) 12", "C) 14", "D) 16", "E) 18"], correctAnswer: 1 }
    ],
    geometry: [
      { question: "What is the volume of a cube with side length 3?", answers: ["A) 27", "B) 12", "C) 18", "D) 9", "E) 6"], correctAnswer: 0 },
      { question: "What is the area of a circle with radius 7?", answers: ["A) 49π", "B) 14π", "C) 21π", "D) 28π", "E) 35π"], correctAnswer: 0 }
    ],
    statistics: [
      { question: "What is the median of 2, 4, 6?", answers: ["A) 2", "B) 4", "C) 6", "D) 5"], correctAnswer: 1 }
    ],
    theory: [
      { question: "What is the currency of Japan?", answers: ["A) Yen", "B) Dollar", "C) Euro", "D) Pound"], correctAnswer: 0 },
      { question: "Who was the first president of the United States?", answers: ["A) Abraham Lincoln", "B) Thomas Jefferson", "C) George Washington", "D) John Adams"], correctAnswer: 2 }
    ],
    trigonometry: [
      { question: "What is tan(30°)?", answers: ["A) 0.5", "B) 1", "C) 1.5", "D) 0.7"], correctAnswer: 0 }
    ]
  },
  hard: {
    algebra: [
      { question: "Solve for x: 2x + 3 = 7", correctAnswer: "x = 2" },
      { question: "Solve for x: 5x - 2 = 18", correctAnswer: "x = 4" }
    ],
    geometry: [
      { question: "Find the area of a triangle with base 8 and height 5.", correctAnswer: "Area = 20" },
      { question: "Find the volume of a cylinder with radius 3 and height 10.", correctAnswer: "Volume = 90π" }
    ],
    statistics: [
      { question: "Find the variance of the data set: 1, 2, 3, 4, 5.", correctAnswer: "2" }
    ],
    theory: [
      { question: "What is the formula for photosynthesis?", correctAnswer: "6CO2 + 6H2O -> C6H12O6 + 6O2" }
    ],
    trigonometry: [
      { question: "Find the value of sin(60°).", correctAnswer: "√3/2" }
    ]
  }
};


// Function to load the questions based on selected difficulty and topic
function loadQuestions() {
  // Check if the question bank exists for the selected difficulty and topic
  if (!questionBank[difficulty] || !questionBank[difficulty][topic]) {
    alert("No questions available for this difficulty/topic.");
    return;
  }

  // Get the list of questions for the current difficulty and topic
  let questions = questionBank[difficulty][topic];

  // Display the current question on the screen
  displayQuestion(questions[currentQuestionIndex]);
}


// Function to display the current question and answer options
function displayQuestion(questionData) {
  const questionContainer = document.getElementById("question-container");
  const answerButtons = document.getElementById("answer-buttons");
  const inputField = document.getElementById("input-field");

  // Set the question text
  questionContainer.innerHTML = `<p>${questionData.question}</p>`;

  // Clear any previous answer options or input field
  answerButtons.innerHTML = "";
  inputField.innerHTML = "";  // Clear any input field for non-hard questions

  // For easy and medium difficulties, create buttons for answer choices
  if (questionData.answers) {
    questionData.answers.forEach((answer, index) => {
      let button = document.createElement("button");
      button.textContent = answer;
      // Add an event listener to each button to check the answer
      button.onclick = () => checkAnswer(index === questionData.correctAnswer, questionData);
      answerButtons.appendChild(button);
    });
  }
  // For hard difficulty, create an input field for the user to type their answer
  else {
    inputField.innerHTML = `
      <input type="text" id="user-answer" placeholder="Your answer">
      <button onclick="checkAnswerHard()">Submit</button>
    `;
    startTimer(); // Start the countdown timer for hard questions
  }
}

// Function to check if the answer is correct for easy and medium difficulties
function checkAnswer(isCorrect, questionData) {
  if (isCorrect) {
    // Points based on difficulty
    score += (difficulty === "easy" ? 10 : (difficulty === "medium" ? 15 : 25));
  } else {
    // Penalty based on difficulty
    score -= (difficulty === "easy" ? 3 : (difficulty === "medium" ? 5 : 10));
  }

  // Move to the next question after a short delay
  currentQuestionIndex++;
  setTimeout(() => {
    // If there are more questions, load the next one
    if (currentQuestionIndex < questionBank[difficulty][topic].length) {
      loadQuestions();
    } else {
      // End the quiz and show the score
      alert(`Game over! Your score: ${score}`);
      saveHighScore(score, username);
      window.location.href = "index.html"; // Redirect to the main page
    }
  }, 1000);
}


// Function to check if the answer is correct for hard questions
function checkAnswerHard() {
  const userAnswer = document.getElementById("user-answer").value.trim();
  const correctAnswer = questionBank[difficulty][topic][currentQuestionIndex].correctAnswer;

  // Check if the user's answer matches the correct answer
  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    score += 25;  // Award points for correct answer
  } else {
    score -= 10;  // Deduct points for incorrect answer
  }

  // Move to the next question after a short delay
  currentQuestionIndex++;
  setTimeout(() => {
    // If there are more questions, load the next one
    if (currentQuestionIndex < questionBank[difficulty][topic].length) {
      loadQuestions();
    } else {
      // If there are no more questions, end the quiz and show the score
      alert(`Game over! Your score: ${score}`);
      saveHighScore(score, username);  // Save the score to the leaderboard
      window.location.href = "index.html";  // Redirect to the main page
    }
  }, 1000);
}

// Function to start the timer for hard questions (1-minute timer)
function startTimer() {
  timeLeft = 60; // Reset the timer to 60 seconds
  timer = setInterval(() => {
    timeLeft--;  // Decrease the time left by 1 each second
    if (timeLeft <= 0) {
      clearInterval(timer);  // Stop the timer when it reaches 0
      alert("Time's up!");  // Notify the player that time is up
      checkAnswer(false);  // Consider the answer incorrect if time runs out
    }
  }, 1000);  // Set the interval to 1 second (1000ms)
}

// Function to save the score to the leaderboard (high scores)
function saveHighScore(score, username) {
  // Retrieve high scores from cookies or initialize an empty array
  let highScores = JSON.parse(getCookie("highScores")) || [];
  highScores.push({ username: username, score: score });  // Add the current score to the leaderboard

  // Sort the scores in descending order and keep only the top 3
  highScores = highScores.sort((a, b) => b.score - a.score).slice(0, 3);
  setCookie("highScores", JSON.stringify(highScores), 30);  // Save the updated scores to cookies
  displayHighScores();  // Update the displayed leaderboard
}

// Function to display the top 3 high scores
function displayHighScores() {
  let highScores = JSON.parse(getCookie("highScores")) || [];
  const scoreList = document.getElementById("score-list");
  scoreList.innerHTML = '';  // Clear the previous list of high scores

  if (highScores.length === 0) {
    scoreList.innerHTML = '<li>No scores yet</li>';
    return;
  }

  // Display each of the top 3 high scores
  highScores.forEach((entry, index) => {
    let listItem = document.createElement('li');
    listItem.textContent = `#${index + 1} - ${entry.username}: ${entry.score}`;
    scoreList.appendChild(listItem);
  });
}

// Load the questions when the page is loaded
loadQuestions();
