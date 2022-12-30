let canvas = document.createElement('canvas');
canvas.setAttribute("id", "myCanvas");
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);
document.body.appendChild(canvas);
window.addEventListener('resize', () => {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
});

// getting the 2D context to control canvas
let
    ctx = canvas.getContext('2d'),
    scores = 0;

let
    // Ball radius
    rBall = 10,
    // Ball initial position from left
    xBall = canvas.width / 2,
    // Ball initial position from top
    yBall = canvas.height - 30,
    // Change in x coordinates at one instance:
    // positive value for right direction
    // negative value for left direction
    dxBall = 1.5,
    // Change in y coordinates at one instance
    // positive value for bottom direction
    // negative value for top direction
    dyBall = -1.5;

let
    // Paddle
    padHeight = 10,
    padWidth = 75,
    xPad = Math.floor((canvas.width - padWidth) / 2);

let
    // Paddle keyboard controls
    rightPressed = false,
    leftPressed = false;


let
    brickRowCount = 2,
    brickColCount = 8,
    brickWidth = Math.floor(canvas.width / 12),
    brickHeight = 15,
    brickPadding = Math.floor(
        (canvas.width - brickWidth * brickColCount)
        /
        (brickColCount + 1)
    ),
    brickOffsetTop = brickPadding,
    brickOffsetLeft = brickPadding,
    bricks = Array.from(
        Array(brickRowCount),
        () => Array.from(
            Array(brickColCount),
            () => ({ x: 0, y: 0, status: true })
        )
    );


const
    keyDownHandler = (e) => {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        }
    },
    keyUpHandler = (e) => {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }, mouseMoveHandler = (e) => {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            xPad = relativeX - padWidth / 2;
        }
    }



const drawBall = () => {
    ctx.beginPath();
    ctx.arc(xBall, yBall, rBall, 0, Math.PI * 2);
    ctx.fillStyle = "#32f4f4";
    ctx.fill();
    ctx.closePath();
}

const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(xPad, canvas.height - padHeight, padWidth, padHeight)
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
}

const drawBricks = () => {
    bricks.forEach((brickRow, row) =>
        brickRow.forEach((brick, col) => {
            if (brick.status) {
                const
                    xBrick = col * (brickWidth + brickPadding) + brickOffsetLeft,
                    yBrick = row * (brickHeight + brickPadding) + brickOffsetTop;
                brick.x = xBrick;
                brick.y = yBrick;
                ctx.beginPath();
                ctx.rect(xBrick, yBrick, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        })
    )
}

const collisionDetection = () => {
    bricks.forEach((brickRow, row) =>
        brickRow.forEach((brick, col) => {
            if (brick.status) {
                if (
                    xBall > brick.x
                    && xBall < brick.x + brickWidth
                    && yBall > brick.y
                    && yBall < brick.y + brickHeight
                ) {
                    dyBall *= -1;
                    brick.status = false;
                    scores++;
                    if (scores === brickRowCount * brickColCount) {
                        rt("YOU WIN, CONGRATULATIONS!");
                        clearInterval(interval);
                    }
                }
            }
        })
    )
}

const drawCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Paddle control
    if (rightPressed)
        xPad = Math.min(xPad + 7, canvas.width - padWidth);
    else if (leftPressed)
        xPad = Math.max(xPad - 7, 0);


    // Ball control
    if (xBall + dxBall < rBall || xBall + dxBall > canvas.width - rBall) dxBall *= -1;
    if (yBall + dyBall < rBall) dyBall *= -1;
    else if (yBall + dyBall > canvas.height - rBall) {
        if (xBall > xPad && xBall < xPad + padWidth) {
            dyBall *= -1;
        } else {
            alert("Game Over");
            window.location.reload();
            clearInterval(interval);
        }
    }
    xBall += dxBall;
    yBall += dyBall;
}

// Paddle controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


const interval = setInterval(drawCanvas, 1);