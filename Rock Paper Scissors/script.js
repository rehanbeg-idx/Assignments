function getComputerChoice() {
  const randomNumber = Math.floor(Math.random() * 3);
  if (randomNumber === 0) {
    return "rock";
  } else if (randomNumber === 1) {
    return "paper";
  } else {
    return "scissors";
  }
}

function getHumanChoice() {
  let choice = prompt("Enter Rock, Paper, Scissors: ");
  if (!choice) {
    alert("You must enter a choice!");
    return getHumanChoice(); 
  }
  choice = choice.toLowerCase();
  if (choice === "rock" || choice === "paper" || choice === "scissors") {
    return choice;
  } else {
    alert("Invalid input! Please enter Rock, Paper, or Scissors.");
    return getHumanChoice(); 
  }
}

function playRound(humanChoice, computerChoice, scores) {
  if (humanChoice === computerChoice) {
    console.log(`It's a tie! You both chose ${humanChoice}.`);
  } else if (
    (humanChoice === "rock" && computerChoice === "scissors") ||
    (humanChoice === "paper" && computerChoice === "rock") ||
    (humanChoice === "scissors" && computerChoice === "paper")
  ) {
    console.log(`You win! ${humanChoice} beats ${computerChoice}.`);
    scores.human++;
  } else {
    console.log(`You lose! ${computerChoice} beats ${humanChoice}.`);
    scores.computer++;
  }
}

function playGame() {
  let scores = { human: 0, computer: 0 };

  for (let i = 1; i <= 5; i++) {
    console.log(`--- Round ${i} ---`);
    const h = getHumanChoice();
    const c = getComputerChoice();
    playRound(h, c, scores);
    console.log(`Score -> You: ${scores.human}, Computer: ${scores.computer}`);
  }

  console.log("--- Final Result ---");
  if (scores.human > scores.computer) {
    console.log(" Congratulations! You win the game.");
  } else if (scores.computer > scores.human) {
    console.log(" Sorry! The computer wins the game.");
  } else {
    console.log(" It's a tie overall!");
  }
}

playGame();
