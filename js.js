document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('my-canvas');

    var ctx = canvas.getContext("2d");

    var fragmentSize = 5;
    var firstClickCoords = { x: 0, y: 0 };
    var secondClickCoords = { x: 0, y: 0 };

    var clickCounter = 0;
    var shiftButtonPressed = false;

    function onWindowResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    onWindowResize();

    window.addEventListener('resize', onWindowResize);

    canvas.addEventListener('click', onClickDraw);

    function onClickDraw(e) {
        ctx.fillStyle = "#F972FF";

        clickCounter++;

        if (clickCounter % 2) {
            firstClickCoords = { x: e.clientX, y: e.clientY };
            secondClickCoords = firstClickCoords;
        } else {
            secondClickCoords = { x: e.clientX, y: e.clientY };

            if (shiftButtonPressed) {
                drawLine(firstClickCoords, secondClickCoords);
            } else {
                drawCircle(firstClickCoords, secondClickCoords);
            }
        }
    }

    function drawLine(start, end) {
        var deltaX = end.x - start.x;
        var deltaY = end.y - start.y;

        var absDeltaX = Math.abs(deltaX);
        var absDeltaY = Math.abs(deltaY);

        var deltas = { x: deltaX, y: deltaY };
        var absDeltas = { x: absDeltaX, y: absDeltaY };

        var mainDir = absDeltaX > absDeltaY ? 'x' : 'y';
        var secondaryDir = absDeltaX > absDeltaY ? 'y' : 'x';

        var secondaryVar = start[secondaryDir];
        var secondaryEnd = deltas[secondaryDir] > 0 ? end[secondaryDir] : start[secondaryDir];
        var directionOfSecondary = (secondaryEnd - secondaryVar > 0) ? 1 : -1;

        var err = 0;
        var deltaErr = absDeltas[secondaryDir];

        var calcAndDraw = function (loopVar, mainDelta) {
            var fillX = mainDir === 'x' ? loopVar : secondaryVar;
            var fillY = mainDir === 'x' ? secondaryVar : loopVar;

            ctx.fillRect(fillX, fillY, fragmentSize, fragmentSize);
            err = err + deltaErr;

            if (2 * err >= mainDelta) {
                secondaryVar = secondaryVar + directionOfSecondary;
                err = err - mainDelta;
            }
        };

        if (deltas[mainDir] > 0) {
            for (var loopVar = start[mainDir]; loopVar <= end[mainDir]; loopVar++) { // proverit yslovie
                calcAndDraw(loopVar, deltas[mainDir]);
            }
        } else {
            for (var loopVar = start[mainDir]; loopVar >= end[mainDir]; loopVar--) { // proverit yslovie
                calcAndDraw(loopVar, absDeltas[mainDir]);
            }
        }
    }

    document.addEventListener('keydown', keyDownShift);

    function keyDownShift(e) {
        if (e.keyCode === 16) shiftButtonPressed = true;
    }

    document.addEventListener('keyup', keyUpShift);

    function keyUpShift(e) {
        if (e.keyCode === 16) shiftButtonPressed = false;
    }


    function drawCircle(start, end) {
        var R = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        var x = 0;
        var y = R;
        var delta = 1 - 2 * R;
        var error = 0;

        while (y >= 0) {
            ctx.fillRect(start.x + x, start.y + y, fragmentSize, fragmentSize);
            ctx.fillRect(start.x + x, start.y - y, fragmentSize, fragmentSize);
            ctx.fillRect(start.x - x, start.y + y, fragmentSize, fragmentSize);
            ctx.fillRect(start.x - x, start.y - y, fragmentSize, fragmentSize);
            error = 2 * (delta + y) - 1;

            if ((delta < 0) && (error <= 0)) {
                delta += 2 * ++x + 1;
                continue;
            }
            if ((delta > 0) && (error > 0)) {
                delta -= 2 * --y + 1;
                continue;
            }
            delta += 2 * (++x - y--);
        }
    }
});

