let difficulty = document.getElementById('difficulty'),
    board = document.getElementById('board'),
    timer = document.getElementById('timer');

let cells = []; //Matrix of cells to keep track

let m = 0, //rows
    n = 0,
    bombs = 0, //columns
    counter = 0;
let timing;


let generateBoard = ()=> {

  for(let i = 0; i < m; i++) {
    cells.push([]);

    let row = document.createElement('div');
    row.className = 'row';

    board.appendChild(row);

    for(let j = 0; j < n; j++) {

      let square = document.createElement('div');
      square.className = 'square';

      row.appendChild(square);

      let cell = {
        square: square,
        x: i,
        y: j,
        val: 0,
        revealed: false
      }

      cells[i].push(cell);

      square.addEventListener('click', ()=> {
        reveal(cell);
      });
    }
  }
}

let generateBombs = ()=> {
  let arr = [];

  for(let i = 0; i < m; i++) {
    for(let j = 0; j < n; j++) {
      arr.push(cells[i][j]);
    }
  }

  for(let i = 0; i < bombs; i++) {
    let cell = arr[Math.floor(Math.random() * arr.length)];
    cell.val = -1;
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

  if(cell.val === -1) {
    gameOver(cell);
  } else if(cell.val > 0) {
    cell.square.innerHTML = cell.val;
    cell.revealed = true;
    cell.square.className += ' revealed';
    counter++;

  } else {

    for(let xoff = -1; xoff <= 1; xoff++) {
      for(let yoff = -1; yoff <= 1; yoff++) {

        if(cell.x+xoff >= 0 && cell.x+xoff < m
          && cell.y+yoff >= 0 && cell.y+yoff < n ){

            if(cells[cell.x + xoff][cell.y + yoff].val !== -1
              && !cells[cell.x + xoff][cell.y + yoff].revealed) {

                cell.revealed = true;
                cell.square.className += ' revealed';
                reveal(cells[cell.x + xoff][cell.y + yoff]);
              }

        }

      }
    }
    counter++;
  }

}

let gameOver = (cell)=> {

  console.log("game over");

  for(let i = 0; i < m; i++) {
    for(let j = 0; j < n; j++) {

      if(cells[i][j].val === -1) {
  		cells[i][j].square.innerHTML = '<img src="bomb.png">';
      	cells[i][j].square.className += ' revealed';
      }
    }
  }
  cell.square.innerHTML = '<img src="explosion.png">';

  reveal = ()=> {};
  clearInterval(timing);
}

let start = (level)=> {
  if(level === 1) {
    m = n = 9;
    bombs = 10;
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
