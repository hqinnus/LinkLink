// This file consists of two javascript library
// KineticJS and CreateJS

// Prepare all files to be loaded here
var manifest = [
    { src: "sounds/button.mp3", id: "buttonMS" },
    { src: "sounds/bgmusic.mp3", id: "bgmusic" }
];
var preload = new createjs.PreloadJS();

// Install SoundJS as one of the plugin for PreloadJS
preload.installPlugin(createjs.SoundJS);

// On preload completed, start to play background music
preload.onComplete = function (event) {
    createjs.SoundJS.play("bgmusic", createjs.SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
};

// Fetch files
preload.loadManifest(manifest, true);

// KineticJS
var stage = new Kinetic.Stage({
    container: "gameDiv",
    width: document.getElementById('gameDiv').clientWidth,
    height: document.getElementById('gameDiv').clientHeight
});
var layer = new Kinetic.Layer();
var bglayer = new Kinetic.Layer();
var messagelayer = new Kinetic.Layer();

// Initializing a 8x8 grid
var grid = [
    [2, 2, 1, 3, 1, 1, 1, 1],
    [0, 1, 2, 1, 1, 3, 3, 3],
    [1, 1, 2, 3, 0, 2, 2, 2],
    [0, 3, 2, 0, 2, 1, 1, 1],
    [3, 1, 0, 1, 1, 0, 0, 0],
    [0, 1, 2, 1, 1, 3, 3, 3],
    [0, 1, 2, 1, 1, 3, 3, 3],
    [0, 3, 2, 0, 2, 1, 1, 1]
];

var row = grid.length;	// Number of Rows
var col = grid[0].length; // Numbers of Columns
var width = stage.getWidth() / col;	// Single Cell Width
var height = stage.getHeight() / row;	// Single Cell Height
var path = [];

var rectArr = new Array();  // To hold a reference of all rectangle object
var soundinstance = null;   // Reference of music to be played when mouse over rectangle
var isMouseDown = false;    // Is mouse button pressed

initialize();

function initialize() {
    for (r = 0; r < row; ++r) {
        rectArr[r] = new Array();
        for (c = 0; c < col; ++c) {

            // Initializing new rectangle object
            var rect = new Kinetic.Rect({
                x: width * c,
                y: height * r,
                width: width,
                height: height,
                stroke: "black",
                strokeWidth: 1,
                opacity: 0.35
            });

            // On mouse button pressed
            rect.on("mousedown", function (event) {
                if (soundinstance == null)
                    soundinstance = createjs.SoundJS.play("buttonMS", createjs.SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
                else
                    soundinstance.play(createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 1);
                isMouseDown = true;
                path[path.length] = this;
                drawGrid(this);
            });

            // On mouse over
            rect.on("mouseover", function (event) {
                if (isMouseDown) {
                    soundinstance.play(createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 1);
                    path[path.length] = this;
                    drawGrid(this);
                }
            });

            // On mouse click
            rect.on("click", function (event) {
                if (path.length > 1) {
                    soundinstance.play(createjs.SoundJS.INTERRUPT_ANY, 0, 0, 0, 1);
                    for (i = 0; i < path.length; ++i) {
                        path[i].hide();
                        addScore(10);
                    }
                    path = [];
                }
                isMouseDown = false;
                drawGrid(this);
            });

            // On mouse move
            rect.on("mousemove", function (event) {
                var mousePos = stage.getMousePosition();
                writeMessage(messagelayer, 'x: ' + mousePos.x + ', y: ' + mousePos.y);
            });

            rectArr[r][c] = rect;   // store the reference to the array
            layer.add(rect);    // add rectangle to the layer
        }
    }
    drawGrid(null);

    // Preparing the background image
    var img = new Image();
    img.src = "images/table.jpg";
    img.onload = function () {
        var bgImg = new Kinetic.Image({
            image: img,
            width: document.getElementById('gameDiv').clientWidth,
            height: document.getElementById('gameDiv').clientHeight
        });
        bglayer.add(bgImg);
        stage.add(bglayer);
        stage.add(layer);
        stage.add(messagelayer);
    };
}

function drawGrid(cellRect) {
    selRect = cellRect;
    for (r = 0; r < row; ++r) {
        for (c = 0; c < col; ++c) {
            switch (grid[r][c]) {
                case 1: rectArr[r][c].setFill("yellow"); break;
                case 2: rectArr[r][c].setFill("purple"); break;
                case 3: rectArr[r][c].setFill("red"); break;
                default: rectArr[r][c].setFill("blue"); break;
            }
        }
    }
    if (selRect != null) {
        selRect.setOpacity(1);
    }
    layer.draw();
}

function writeMessage(messageLayer, message) {
    var context = messageLayer.getContext();
    messageLayer.clear();
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
}

function addScore(value) {
    var score = parseInt(document.getElementById("score").innerHTML);
    document.getElementById("score").innerHTML = (score + value) + " pts";
}
