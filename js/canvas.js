let mouseIsDown = false;
let lastX = 0;
let lastY = 0;
let pencilColor = "#558A3A";
let canvas = null;
let ctx = null;

/**  
 * Set up variables and mouse events on page load.
 */
window.onload = function () {
    canvas = document.getElementById("canvas");
    // Stretch canvas to fill the entire window.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    // Make corners and ends of lines smooth.
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 16;
    ctx.strokeStyle = pencilColor;

    // Mouse is pressed down, set initial values for coordinates for stroke.
    canvas.addEventListener("mousedown", (event) => {
        mouseIsDown = true;
        lastX = event.offsetX;
        lastY = event.offsetY;
    });
    canvas.addEventListener("mouseup", () => {
        mouseIsDown = false;
    });
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseout", () => {
        mouseIsDown = false
    });
}

/**
 * Draw a line on the canvas.
 * 
 * @param {event} event The MouseEvent detected.
 */
function draw(event) {
    // Draw only when the mouse is pressed down (mousedown state).
    if (mouseIsDown) {
        // Create a line from current mouse location to last known coordinates.
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        lastX = event.offsetX;
        lastY = event.offsetY;
    }
}

/**
 * Set the drawing tool to an eraser.
 */
function eraser() {
    // Use destination-out to remove strokes instead of overlapping with background color.
    ctx.globalCompositeOperation = "destination-out";
    // Widen the drawing line to make it easer to erase.
    ctx.lineWidth = 32;
}

/**
 * Set the drawing tool to a pencil.
 */
function pencil() {
    ctx.globalCompositeOperation = "source-over";
    // Reset the line width to 16 in case an eraser was used.
    ctx.lineWidth = 16;
}

/**
 * Clear the canvas and set the radio focus back to the pencil tool.
 */
function clearDrawing() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Set focus back to the pencil tool
    document.getElementById("pencilButton").checked = true;
    pencil();
    document.getElementById("clearButton").checked = false;
}