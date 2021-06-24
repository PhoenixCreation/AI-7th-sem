// DOM elements
const container = document.getElementById("tictactoe");
// Get the root element
const root = document.querySelector(":root");
// Size form
const form = document.getElementById("form");
// Input box
const sizeInput = document.getElementById("sizefield");
// win count indicator
const labelx = document.getElementById("labelx");
const labelo = document.getElementById("labelo");
// turn indicator
const indicator = document.getElementById("indicator");
// restart button
const restartbtn = document.getElementById("restart");
// close button for relative links
const closeRelatives = document.getElementById("close__relative");
const relativeLinks = document.getElementById("relative__links");
closeRelatives.onclick = () => {
  relativeLinks.style.display = "none";
};
var board = [];

const game = (size = 3, wins = { x: 0, o: 0 }) => {
  // whenever restart is pressed
  restartbtn.onclick = () => {
    game(size);
  };
  // change the css varible
  root.style.setProperty("--size", size);

  // clean the conatainer if there is already something
  container.innerHTML = "";
  // update the labels
  labelx.innerHTML = "X : " + wins.x;
  labelo.innerHTML = "O : " + wins.o;

  // utitlity varibale
  const size2 = size * size;

  // varible that keeps track of turn of player
  // true means player 1 and false means player 2
  let turn = true;

  // array of box elements that holds the reference to DOM of each box
  // index from 0 to 8
  const boxes = [];
  board = [];
  const sequence = {};

  // create size * size DOM elements of boxes like
  // <div className="box" id="box1"></div>
  for (let i = 0; i < size2; i++) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.id = `box${i + 1}`;
    // on clicking of the boxes
    box.onclick = () => handleClick(i);
    boxes.push(box);
    container.appendChild(box);
  }

  // fill the board with null
  for (let i = 0; i < size; i++) {
    if (!board[i]) board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i][j] = null;
    }
  }

  // function that handles the click
  /**
   *
   * @param {number} boxNo
   */
  const handleClick = (boxNo) => {
    /**
     * @type {HTMLElement}
     */
    const box = boxes[boxNo];
    if (box.classList.contains("x") || box.classList.contains("o")) {
      console.log("alredy played");
      return;
    }
    const x = Math.floor(boxNo / size);
    const y = boxNo % size;
    setMove(x, y, boxNo);
  };

  // Function that sets the move based on current turn
  /**
   *
   * @param {number} x row index
   * @param {number} y column index
   * @param {number} total row * size + column,it will be alredy avaible so why bother calculating again
   */
  const setMove = (x, y, total) => {
    const className = turn ? "x" : "o";
    board[x][y] = className;
    /**
     * @type {HTMLElement}
     */
    const box = boxes[total];
    box.classList.add(className);
    toggleTurn();
  };

  // Function that changes turn
  const toggleTurn = () => {
    const win = checkWin(turn);
    if (win !== null) {
      if (win === "x") {
        wins.x++;
        labelx.innerHTML = `X : ${wins.x}`;
        alert("X player won");
      }
      if (win === "o") {
        wins.o++;
        labelo.innerHTML = `O : ${wins.o}`;
        alert("O player won");
      }
      if (win === "draw") {
        alert("Match draw");
      }
      if (sequence.type == "row") {
        let index = sequence.index * size;
        for (let i = 0; i < size; i++) {
          boxes[index].classList.add("win");
          index++;
        }
      } else if (sequence.type == "column") {
        let index = sequence.index;
        for (let i = 0; i < size; i++) {
          boxes[index + i * size].classList.add("win");
        }
      } else if (sequence.type == "cross") {
        if (sequence.index === 0) {
          for (let i = 0; i < size; i++) {
            boxes[i * size + i].classList.add("win");
          }
        } else if (sequence.index === 1) {
          let ix = 0;
          let iy = size - 1;
          for (let i = 0; i < size; i++) {
            boxes[ix * size + iy].classList.add("win");
            ix++;
            iy--;
          }
        }
      }
      setTimeout(() => {
        game(size, wins);
      }, 2000);
    }
    turn = !turn;
    if (turn) {
      indicator.style.left = "0%";
      indicator.style.background = "var(--xcolor)";
      indicator.style.border = "1px solid var(--ocolor)";
    } else {
      indicator.style.left = "50%";
      indicator.style.background = "var(--ocolor)";
      indicator.style.border = "1px solid var(--xcolor)";
    }
  };

  // Function that checks for the win
  /**
   *
   * @param {boolean} isXLast if last move was done by X
   * @returns {("x"|"o"|"draw"|null)}
   */
  const checkWin = (isXLast) => {
    if (isXLast) {
      if (checkWinForSymbol("x")) {
        return "x";
      }
      // Lastly we will need to check for draw
      if (checkDraw()) {
        return "draw";
      }
      return null;
    }
    if (checkWinForSymbol("o")) {
      return "o";
    }
    // Lastly we will need to check for draw
    if (checkDraw()) {
      return "draw";
    }
    return null;
  };

  // Function to check if specific symbolic player won
  /**
   *
   * @param {("x"|"o")} symbol symbol to check against
   * @returns {boolean}
   */
  const checkWinForSymbol = (symbol) => {
    // If x wins then set this to true
    let win = false;

    // First we will check for each row
    for (let i = 0; i < size; i++) {
      // get the count of same elements in the row
      const count = board[i].reduce((acc, crnt) => {
        if (crnt === symbol) {
          return acc + 1;
        }
        return acc;
      }, 0);
      // if count and size are same then player got whole row with same elements
      if (count === size) {
        sequence.type = "row";
        sequence.index = i;
        win = true;
        break; // no need to continue the loop(for i from 0 to size)
      }
    }
    // If Win is true the no need to wait, return true
    if (win) {
      return true;
    }

    // Secondly we need to check all columns
    for (let i = 0; i < size; i++) {
      let count = 0;
      // get the count of same elements in the column
      for (let j = 0; j < size; j++) {
        // [j][i] giver transposed matrix
        if (board[j][i] === symbol) {
          count++;
        }
      }
      // if count and size are same then player got whole column with same elements
      if (count === size) {
        sequence.type = "column";
        sequence.index = i;
        win = true;
        break; // no need to continue the loop(for i from 0 to size)
      }
    }
    // If Win is true the no need to wait,  return true
    if (win) {
      return true;
    }

    // thirdly we need to check for cross lines
    let i = 0;
    let j = 0;
    let count = 0;
    for (let ii = 0; ii < size; ii++) {
      if (board[i][j] === symbol) {
        count++;
      }
      i++;
      j++;
    }
    console.log({ count, size });
    if (count === size) {
      sequence.type = "cross";
      sequence.index = 0;
      win = true;
    }
    // If Win is true the no need to wait, return true
    if (win) {
      return true;
    }
    i = 0;
    j = size - 1;
    count = 0;
    for (let ii = 0; ii < size; ii++) {
      if (board[i][j] === symbol) {
        count++;
      }
      i++;
      j--;
    }
    if (count === size) {
      sequence.type = "cross";
      sequence.index = 1;
      win = true;
    }
    // If Win is true the no need to wait, return true
    if (win) {
      return true;
    }
    return false;
  };

  // Function to check for draw
  /**
   *
   * @returns boolean
   */
  const checkDraw = () => {
    // If all elements in boards array is not null then it is draw
    let count = 0;
    for (let i = 0; i < board.length; i++) {
      const element = board[i];
      count += element.reduce((acc, crnt) => {
        if (crnt !== null) {
          return acc + 1;
        }
        return acc;
      }, 0);
    }
    if (count === size2) {
      return true;
    }
    return false;
  };
};
game();

form.onsubmit = (e) => {
  e.preventDefault();
  if (isNaN(sizeInput.value) || sizeInput.value > 10 || sizeInput.value < 3) {
    alert("only numbers between 3 and 10 are allowed");
    return;
  }
  game(parseInt(sizeInput.value));
};
