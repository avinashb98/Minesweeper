let difficulty = document.getElementById('difficulty'),
    board = document.getElementById('board'),
    timer = document.getElementById('timer'),
    reset = document.getElementById('reset'),
    end   = document.getElementById('end');

let cells = []; //Matrix of cells to keep track

let m = 0, //rows
    n = 0,
    bombs = 0, //columns
    revealedCells = 0;
let timing;

//Unicode Characters
let bombCharacter = "<span>&#128163;</span>",
    explosionCharacter = "<span>&#128293;</span>";


let generateBoard = ()=> {

  for(let i = 0; i < m; i++) {

    cells.push([]); //Empty container array

    let row = document.createElement('div');
    row.className = 'row';

    board.appendChild(row);

    for(let j = 0; j < n; j++) {

      let square = document.createElement('div');
      square.className = 'square';

      row.appendChild(square);

      let cell = {
        square: square, //store HTML element
        x: i,           //row position in the board
        y: j,           //column position in the board
        val: 0,         //number of bombs in the neightbouring cells
        revealed: false //status of the cell
      }

      cells[i].push(cell);

      //reveal cell on click
      square.addEventListener('click', ()=> {
        reveal(cell);
      });

    }
  }
}

let generateBombs = ()=> {
  let arr = [];

  //linear array to store all the cells
  for(let i = 0; i < m; i++) {
    for(let j = 0; j < n; j++) {
      arr.push(cells[i][j]);
    }
  }

  for(let i = 0; i < bombs; i++) {
    //randomly select cell from arr and place bomb
    let cell = arr[Math.floor(Math.random() * arr.length)];
    cell.val = -1;

    /*
      remove cell from the array when the bomb is placed
      to prevent repititive placement
    */
    arr.splice(arr.indexOf(cell), 1);
  }

}

let generateValues = ()=> {

  for(let i = 0; i < m; i++) {
    for(let j = 0; j < n; j++) {

      //Calculating Values of each cell
      for(let xoff = -1; xoff <= 1; xoff++) {
        for(let yoff = -1; yoff <= 1; yoff++) {
          if(
            cells[i][j].val !== -1
            && (i+xoff)>= 0 && (i+xoff) < m
            && (j+yoff)>= 0 && (j+yoff) < n) {
              if(cells[i+xoff][j+yoff].val === -1) {
                cells[i][j].val += 1;
              }
          }
        }
      }

    }
  }
}

let reveal = (cell)=> {

  if(!cell.revealed) {

    if(cell.val === -1) {

      gameOver(cell);
      return;
    
    } else if(cell.val > 0) {
      
      cell.square.innerHTML = cell.val;
  
      //Color-Code cell values
      if(cell.val === 2) {
        cell.square.className += ' green';
      }
      else if(cell.val > 2) {
        cell.square.className += ' red';
      }
  
      cell.revealed = true;
      cell.square.className += ' revealed';
  
    } else {
  
      //Index Offsets
      for(let xoff = -1; xoff <= 1; xoff++) {
        for(let yoff = -1; yoff <= 1; yoff++) {
  
          //Border Checks
          if(cell.x+xoff >= 0 && cell.x+xoff < m
            && cell.y+yoff >= 0 && cell.y+yoff < n ){
  
              //neighbour cell isn't bomb and not yet revealed
              if(cells[cell.x + xoff][cell.y + yoff].val !== -1
                && !cells[cell.x + xoff][cell.y + yoff].revealed) {
  
                  cell.revealed = true;
                  cell.square.className += ' revealed';
                  reveal(cells[cell.x + xoff][cell.y + yoff]);
                }
  
          }
  
        }
      }
    }
  
    revealedCells++;
    if(revealedCells === (m * n) - bombs) {
      gameWon();
    }
  }
}

let gameOver = (cell)=> {

  for(let i = 0; i < m; i++) {
    for(let j = 0; j < n; j++) {

      if(cells[i][j].val === -1) {
  		  cells[i][j].square.innerHTML = bombCharacter;
      	cells[i][j].square.className += ' revealed';
      }
    }
  }
  cell.square.innerHTML = explosionCharacter;
  clearInterval(timing);
  end.hidden = false;
  end.textContent = "You are blown away!!";
  reset.hidden = false;
}


let start = (level)=> {
  if(level === 1) {
    m = n = 9;
    bombs = 1;
  }
  if(level === 2) {
    m = n = 16;
    bombs = 40;
  }
  if(level === 3) {
    m = 16;
    n = 30;
    bombs = 99;
  }

  safeCells = m * n - bombs;

  difficulty.hidden = true;
  generateBoard();
  generateBombs();
  generateValues();

  let sec = 0;
  let min = 0;
  timing = setInterval(()=> {
  	if(sec === 60) {
  		sec = 0;
  		min++;
  	}

  	if(sec < 10 && min < 10) {
  		timer.innerHTML = `0${min}:0${sec}`;
  	} else if(sec >=10 && min < 10) {
  		timer.innerHTML = `0${min}:${sec}`;
  	} else if(sec < 10 && min >= 10) {
  		timer.innerHTML = `${min}:0${sec}`;
  	} else {
  		timer.innerHTML = `${min}:${sec}`;
  	}

  	sec++;
  }, 1000);
}

let gameWon = ()=> {
  clearInterval(timing);
  end.hidden = false;
  end.textContent = "You Win!!";
  reset.hidden = false;
}


