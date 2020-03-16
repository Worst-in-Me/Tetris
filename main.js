const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE"; // цвет для пустого квадрата


drawSquare = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

let board = [];
for (let i = 0; i < ROW; i++) {
    board[i] = [];
    for (let j = 0; j < COL; j++) {
        board[i][j] = VACANT;
    }
}

drawBoard = () => {
    for (let i = 0; i < ROW; i++)
        for (let j = 0; j < COL; j++) 
            drawSquare(j, i, board[i][j]);
}

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "blue"],
    [O, "purple"],
    [L, "cyan"],
    [I, "orange"],
    [J, "yellow"],
];

let p = new Piece(PIECES[0][0], PIECES[0][1]);

function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    this.x = 3;
    this.y = 0;
}

Piece.prototype.fill = function (color) {
    for (let i = 0; i < this.activeTetromino.length; i++)
        for (let j = 0; j < this.activeTetromino.length; j++) {
            if (this.activeTetromino[i][j]) {
                drawSquare(this.x + j, this.y + i, color);
            }
        }
}

Piece.prototype.draw = function() {
    this.fill(this.color);
}

Piece.prototype.unDraw = function() {
    this.fill(VACANT);
}

Piece.prototype.moveDown = function() {
    if(!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {

    }
}

Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    } else {

    }
}

Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    } else {

    }
}

Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    if (!this.collision(0, 0, nextPattern)) {
        this.unDraw();
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    } else {

    }
}

Piece.prototype.collision = function(x, y, piece) {
    for (let i = 0; i < piece.length; i++)
        for (let j = 0; j < piece.length; j++) {
            if(!piece[i][j])
                continue;

            let newX = this.x + j + x;
            let newY = this.y + i + y;

            if(newX < 0 || newX >= COL || newY >= ROW)
                return true;

            if(newY < 0)
                continue;

            if(board[newY][newX] != VACANT)
                return true;
        }
    return false;
}

document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
        dropStart = Date.now();
    }
}

let dropStart = Date.now();
drop = () => {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    requestAnimationFrame(drop);
}

drawBoard();
drop();