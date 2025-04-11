//questions data
const quizQuestions = [
  {
    question: "What does HTML stand for?",
    options: ["HyperText Markup Language", "HyperText Multiple Language", "HyperText Markup Leveler", "HyperText Master Language"],
    answer: "HyperText Markup Language"
  },
  {
    question: "Which CSS property is used to set the background color of an element?",
    options: ["color", "background-color", "text-color", "fill-color"],
    answer: "background-color"
  },
  {
    question: "What is the purpose of the 'this' keyword in JavaScript?",
    options: ["To refer to the global object", "To refer to the current element being processed", "To refer to the parent element", "To refer to the child element"],
    answer: "To refer to the current element being processed"
  },
  {
    question: "Which JavaScript method is used to select an element by its ID?",
    options: ["getElementById", "getElementsByClassName", "getElementsByTagName", "querySelector"],
    answer: "getElementById"
  },
  {
    question: "What is the difference between 'null' and 'undefined' in JavaScript?",
    options: ["null is a primitive value, while undefined is an object", "null is an object, while undefined is a primitive value", "null represents an empty object, while undefined represents an uninitialized variable", "null represents an uninitialized variable, while undefined represents an empty object"],
    answer: "null represents an empty object, while undefined represents an uninitialized variable"
  },
  {
    question: "Which CSS unit is relative to the font size of the parent element?",
    options: ["px", "em", "rem", "%"],
    answer: "em"
  },
  {
    question: "What is the purpose of the 'preventDefault' method in JavaScript?",
    options: ["To prevent the default action of an event", "To trigger the default action of an event", "To stop the propagation of an event", "To start the propagation of an event"],
    answer: "To prevent the default action of an event"
  },
  {
    question: "Which JavaScript method is used to add an event listener to an element?",
    options: ["addEventListener", "removeEventListener", "dispatchEvent", "triggerEvent"],
    answer: "addEventListener"
  },
  {
    question: "What is the difference between 'display: block' and 'display: inline' in CSS?",
    options: ["display: block takes up the full width of its parent, while display: inline takes up only the space needed for its content", "display: block takes up only the space needed for its content, while display: inline takes up the full width of its parent", "display: block is used for inline elements, while display: inline is used for block-level elements", "display: block is used for block-level elements, while display: inline is used for inline elements"],
    answer: "display: block takes up the full width of its parent, while display: inline takes up only the space needed for its content"
  },
  {
    question: "Which CSS property is used to set the opacity of an element?",
    options: ["opacity", "transparency", "visibility", "alpha"],
    answer: "opacity"
  }
];

//DOM elements
const startContainer = document.getElementById('start-container');
const startButton = document.getElementById('start-quiz');
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById('showAnswer');
const timerElement = document.getElementById('time');
const quizHeading = document.getElementById('quiz-heading');
const timerContainer = document.getElementById('timer-container');
const nextButton = document.getElementById('next');

let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];
let timeLeft = 420;
let timeInterval;

function startTimer() {
  clearInterval(timeInterval); // Prevent multiple intervals
  timeInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      alert("Time is up! Restarting the quiz...");
      retryQuiz();
    }
  }, 1000);
}

//convert seconds into mm:ss
function formatTime(sec) {
  let minutes = Math.floor(sec / 60);
  let seconds = sec % 60;
  return `${minutes}m:${seconds < 10 ? "0" : ""}${seconds}s`;
}

//Shuffle options to prevent fixed ordering
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//Display current question and shuffled options
function displayQuestion() {
  const questionData = quizQuestions[currentQuestion];
  const questionElement = document.createElement('div');
  questionElement.className = 'question';
  questionElement.innerHTML = `${currentQuestion + 1} : ${questionData.question}`;

  const optionsElement = document.createElement('div');
  optionsElement.className = 'options';

  const shuffledOptions = [...questionData.options];
  shuffleArray(shuffledOptions);

  for (let i = 0; i < shuffledOptions.length; i++) {
    const option = document.createElement('label');
    option.className = 'option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz';
    radio.value = shuffledOptions[i];

    //Instant feedback on option selection
    radio.addEventListener('change', () => {
      const correct = quizQuestions[currentQuestion].answer;
      const allLabels = document.querySelectorAll('.option');
      allLabels.forEach(label => {
        const input = label.querySelector('input');
        if (input.value === correct) {
          label.classList.add('correct');
        } else if (input.checked) {
          label.classList.add('incorrect');
        }
        input.disabled = true;
      });
      nextButton.classList.remove('hide');
    });

    const optionText = document.createTextNode(shuffledOptions[i]);
    option.appendChild(radio);
    option.appendChild(optionText);
    optionsElement.appendChild(option);
  }

  // Replace old content with new
  quizContainer.innerHTML = '';
  quizContainer.appendChild(questionElement);
  quizContainer.appendChild(optionsElement);
}

//next button handler
nextButton.addEventListener('click', () => {
  const selectedOption = document.querySelector('input[name="quiz"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    if (answer === quizQuestions[currentQuestion].answer) {
      score++;
    } else {
      incorrectAnswers.push({
        question: quizQuestions[currentQuestion].question,
        incorrectAnswer: answer,
        correctAnswer: quizQuestions[currentQuestion].answer,
      });
    }
    currentQuestion++;
    nextButton.classList.add('hide');
    if (currentQuestion < quizQuestions.length) {
      displayQuestion();
    } else {
      displayResult();
    }
  }
});

//Final result display
function displayResult() {
  clearInterval(timeInterval);
  quizContainer.classList.add('hide');
  quizHeading.classList.add('hide');
  timerContainer.classList.add('hide');
  retryButton.classList.remove('hide');
  showAnswerButton.classList.remove('hide');
  resultContainer.innerHTML = `You scored ${score} out of ${quizQuestions.length}!`;
}

function retryQuiz() {
  currentQuestion = 0;
  score = 0;
  timeLeft = 420;
  incorrectAnswers = [];
  startContainer.style.display = 'none';
  quizContainer.classList.remove('hide');
  quizHeading.classList.remove('hide');
  timerContainer.classList.remove('hide');
  resultContainer.innerHTML = '';
  retryButton.classList.add('hide');
  showAnswerButton.classList.add('hide');
  nextButton.classList.add('hide');
  displayQuestion();
  startTimer();
}

function showAnswer() {
  quizContainer.classList.add('hide');
  nextButton.classList.add('hide');
  retryButton.classList.remove('hide');
  showAnswerButton.classList.add('hide');

  let incorrectAnswersHtml = '';
  for (let i = 0; i < incorrectAnswers.length; i++) {
    incorrectAnswersHtml += `
      <p>
        <strong>Question:</strong> ${incorrectAnswers[i].question}<br>
        <span class="incorrect-ans">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>
        ${incorrectAnswers[i].incorrectAnswer}</span><br>
        <span class="correct-ans">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
        </svg>
        ${incorrectAnswers[i].correctAnswer}</span>
      </p>
      <hr/>
    `;
  }

  resultContainer.innerHTML = `
    <p class="score">You scored ${score} out of ${quizQuestions.length}!</p>
    <p class="incoreect-ans-heading">Incorrect Answers:</p>
    ${incorrectAnswersHtml}
  `;
}

startButton.addEventListener('click', () => {
  startContainer.style.display = 'none';
  quizContainer.classList.remove('hide');
  quizHeading.classList.remove('hide');
  timerContainer.classList.remove('hide');
  resultContainer.innerHTML = '';
  displayQuestion();
  startTimer();
});

retryButton.addEventListener('click', retryQuiz);
showAnswerButton.addEventListener('click', showAnswer);
