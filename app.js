var cv = document.getElementById('cv');
var ctx = cv.getContext('2d');
var canvas = ctx.canvas ;
var img = new Image();
var dataURL = '';
var color = 'black';
var text = '';
var textX = '';
var textY = '';

// variables used to get mouse position on the canvas
var $canvas = $("#cv");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();

var texts = [];
// variables to save last mouse position
// used to see how far the user dragged the mouse
// and then move the text by that distance
var startX;
var startY;

// this var will hold the index of the selected text
var selectedText = -1;

document.getElementById('formFile').addEventListener('change', readImage, false);

document.getElementById('formColor').addEventListener('input', function(e){
    color = e.target.value
    setText(text)
}, false);

document.getElementById('formWatermark').addEventListener('input', function(e){
    text = e.target.value
    setText(text)
}, false);

function setText(watermark){
    var hRatio = canvas.width  / img.width    ;
    var vRatio =  canvas.height / img.height  ;
    var ratio  = Math.min ( hRatio, vRatio );
    var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
    var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  

    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.drawImage(img, 0,0, img.width, img.height,
                        centerShift_x,centerShift_y,img.width*ratio, img.height*ratio); 
                        
    ctx.fillStyle = color;
    ctx.font = "bold 24px Arial";
    textX = (cv.width / 2) - 17;
    textY = (cv.height / 2) + 8;

    texts = [{text: watermark, x: textX, y: textY}]

    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        text.width = ctx.measureText(text.text).width;
        text.height = 16;
    }

    ctx.fillText(watermark, textX, textY);
}

function readImage(event){
    var reader = new FileReader();
    // read file
    dataURL = event.target.files[0];

    reader.readAsDataURL(dataURL);
    reader.onload = function(e) {
        img.onload = function() {
            var hRatio = canvas.width  / img.width    ;
            var vRatio =  canvas.height / img.height  ;
            var ratio  = Math.min ( hRatio, vRatio );
            var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
            var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  

            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.drawImage(img, 0,0, img.width, img.height,
                                centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
        }
        
        // set image src
        img.src = e.target.result;
    }
}

// test if x,y is inside the bounding box of texts[textIndex]
function textHittest(x, y, textIndex) {
    var text = texts[textIndex];
    console.log('mouse down text x:'+text.x+' - y:'+text.y)
    console.log('mouse down x:'+x+' - y:'+y)
    // console.log('return', ((x >= text.x && x <= text.x + text.width) && (y >= text.y - text.height && y <= text.y)))
    return (x >= text.x && x <= text.x + text.width && y >= text.y - text.height && y <= text.y);
}

// handle mousedown events
// iterate through texts[] and see if the user
// mousedown'ed on one of them
// If yes, set the selectedText to the index of that text
function handleMouseDown(e) {
    e.preventDefault();
    console.log('mouse down',texts)
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    // Put your mousedown stuff here
    for (var i = 0; i < texts.length; i++) {
        if (textHittest(startX, startY, i)) {
            $('#cv').css('cursor','pointer');
            selectedText = i;
        }
    }
}

// done dragging
function handleMouseUp(e) {
    e.preventDefault();
    selectedText = -1;
    $('#cv').css('cursor','auto');
}

// also done dragging
function handleMouseOut(e) {
    e.preventDefault();
    selectedText = -1;
}

// handle mousemove events
// calc how far the mouse has been dragged since
// the last mousemove event and move the selected text
// by that distance
function handleMouseMove(e) {
    if (selectedText < 0) {
        return;
    }
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // Put your mousemove stuff here
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;

    var text = texts[selectedText];
    text.x += dx;
    text.y += dy;
    setText(text);
}

// listen for mouse events
$("#cv").mousedown(function (e) {
    handleMouseDown(e);
});
$("#cv").mousemove(function (e) {
    handleMouseMove(e);
});
$("#cv").mouseup(function (e) {
    handleMouseUp(e);
});
$("#cv").mouseout(function (e) {
    handleMouseOut(e);
});