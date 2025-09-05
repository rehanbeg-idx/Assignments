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

  choice.toLowerCase();
  if (choice === "rock" || choice === "paper" || choice === "scissors") {
    return choice;
  }
  alert("Invalid input! Please enter Rock, Paper, or Scissors.");
}

function playGame() {
  let humanScore = 0;
  let computerScore = 0;

  function playRound(humanChoice, computerChoice) {
    humanChoice = humanChoice.toLowerCase();

    if (humanChoice === computerChoice) {
      console.log(`It's a tie! You both chose ${humanChoice}.`);
    } else if (
      (humanChoice === "rock" && computerChoice === "scissors") ||
      (humanChoice === "paper" && computerChoice === "rock") ||
      (humanChoice === "scissors" && computerChoice === "paper")
    ) {
      console.log(`You win! ${humanChoice} beats ${computerChoice}.`);
      humanScore++;
    } else {
      console.log(`You lose! ${computerChoice} beats ${humanChoice}.`);
      computerScore++;
    }
  }

  for (let i = 1; i <= 5; i++) {
    console.log(`\nRound ${i}`);
    const h = getHumanChoice();
    const c = getComputerChoice();
    playRound(h, c);
    console.log(`Score -> You: ${humanScore}, Computer: ${computerScore}`);
  }

  console.log("\nFinal Result:");
  if (humanScore > computerScore) {
    console.log("Congratulations! You win the game 🎉");
  } else if (computerScore > humanScore) {
    console.log("Sorry! The computer wins the game 🤖");
  } else {
    console.log("It's a tie overall!");
  }
}

playGame();
