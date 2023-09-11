let canvas;
let context;

let canvasList = [];
let contextList = [];

const CANVAS_WIDTH = 2880;//1440;
const CANVAS_HEIGHT = 1536;//768;

// 이 큐는 매우 매우 느리다. 나중에 빠른 구현 만들어야지
class Queue {
    constructor() {
      this._arr = [];
    }
    enqueue(item) {
      this._arr.push(item);
    }
    dequeue() {
      return this._arr.shift();
    }
    front() {
        return this._arr[0];
    }
    empty() {
        return this._arr.length == 0;
    }
}

let print_ = (str) => {
    console.log('==> ' + str);
}

var Module = {'print': print_};

let imageFilenameList = {};
let imageMap = [undefined];

function loadImage(filename) {
    if(imageFilenameList[filename] !== undefined)
        return imageFilenameList[filename];

    let image = new Image();
    image.src = filename;
    image.onload = () => {
        ;
    }

    imageMap.push(image);

    imageFilenameList[filename] = imageMap.length - 1;

    //console.log('loadImage ' + filename);
    //console.log('id : ' + (imageMap.length - 1));
    return imageMap.length - 1;
}

// get image name from C heap
function loadImage_() {
    let str = Module.UTF8ToString(Module._data_buffer, 65536);

    return loadImage('images/' + str + '.png');
}

function drawImage(context, image, x, y, imageX, imageY) {
    //console.log(image);
    context.drawImage(image, x, y, imageX, imageY);
}

function drawImage_(context_id, image_id, x, y, imageX, imageY) {

    //console.log(`DrawImage ${context_id} ${image_id} ${x} ${y} ${imageX} ${imageY}`);

    if(image_id == 0)
        return;

    let context = contextList[context_id];

    drawImage(context, imageMap[image_id], x, y, imageX, imageY);
}

function set_font_(context_id, size) {
    let fontName = Module.UTF8ToString(Module._data_buffer, 65536);
    let context = contextList[context_id];

    if(fontName == '강원교육튼튼')
        fontName = 'Gangwon';

    fontName += ', sans-serif';

    context.font = size + 'px ' + fontName;
}

const loadScript = (src) => {
    let scriptEle = document.createElement("script");

    scriptEle.setAttribute("src", src);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", true);

    document.body.appendChild(scriptEle);

    //document.body.innerHTML += "<script src=\"" + src + "\">";
}

const text_test = (str, x, y) => {
    context.fillText(str, 0, 0);
}

const text_test_ = (x, y) => {
    let str = Module.UTF8ToString(Module._data_buffer, 65536);
    //console.log('text_test ' + str);
    text_test(str, x, y);
}

const bitmap_width_ = (image_id) => {
    if(image_id == 0)
        return 0;

    return imageMap[image_id].width;
}

const bitmap_height_ = (image_id) => {
    if(image_id == 0)
        return 0;

    return imageMap[image_id].height;
}

function createCanvas(width, height) {
    var c = document.createElement('canvas');
    c.setAttribute('width', width);
    c.setAttribute('height', height);
    return c;
}

const CreateCompatibleDC_ = () => {
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    let context = canvas.getContext('2d');

    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //context.scale(2, 2);

    let idx = 0;
    while(canvasList[idx] != undefined)
        idx++;

    //canvasList.push(canvas);
    //contextList.push(context);
    canvasList[idx] = canvas;
    contextList[idx] = context;

    return idx;
}

const BitBlt_ = (context_id, x, y, width, height, context2_id) => {

    //console.log(`BitBlt (${context_id}, ${x}, ${y}, ${width}, ${height}, ${context2_id})`);

    let context = contextList[context_id];
    let image = canvasList[context2_id];

    context.drawImage(image, x, y, width, height);
}

const AlphaBlend_ = (context_id, x, y, width, height, context2_id, alpha) => {

    //console.log(`BitBlt (${context_id}, ${x}, ${y}, ${width}, ${height}, ${context2_id})`);

    let context = contextList[context_id];
    let image = canvasList[context2_id];

    context.globalAlpha = alpha / 255;

    context.drawImage(image, x, y, width, height);

    context.globalAlpha = 1;
}

const DeleteDC_ = (canvas_id) => {
    canvasList[canvas_id] = undefined;
    contextList[canvas_id] = undefined;
}

const StopSound_ = () => {
    let audio = document.getElementById("myAudio");

    audio.pause();
}

const StartSound_ = (is_loop) => {
    let audio = document.getElementById("myAudio");
    let music = 'audio/' + Module.UTF8ToString(Module._data_buffer, 65536) + '.mp3';

    if(is_loop)
        audio.loop = true;
    else
        audio.loop = false;

    audio.src = music;
    audio.play();
}

const toHex = (k) => {
    let res = k.toString(16);

    if(res.length == 1)
        return '0' + res;
    else
        return res;
}

function drawTextBox(ctx, text, x, y, fieldWidth, spacing) {
    var line = "";
    var fontSize = parseFloat(ctx.font);
    var currentY = y;
    ctx.textBaseline = "top";
    for(var i=0; i<text.length; i++) {
      var tempLine = line + text[i];
      var tempWidth = ctx.measureText(tempLine).width;
   
      if (tempWidth < fieldWidth && text[i] != '\n') {
        line = tempLine;
      }
      else {
        ctx.fillText(line, x, currentY);
        if(text[i] != '\n') line = text[i];
        else line = "";
        currentY += fontSize*spacing;
      }
    }
    ctx.fillText(line, x, currentY);
    //ctx.rect(x, y, fieldWidth, currentY-y+fontSize*spacing);
    ctx.stroke();
  }
  

// 1: DT_LEFT, 2: DT_CENTER, 4: DT_RIGHT
const DrawText_ = (context_id, x, y, align, r, g, b, width) => {
    //console.log(`DrawText ${context_id} ${x} ${y} ${align}`);

    let context = contextList[context_id];
    let str = Module.UTF8ToString(Module._data_buffer, 65536);

    if(align & 1)
        context.textAlign = 'left';
    else if(align & 2)
        context.textAlign = 'center';
    else if(align & 4)
        context.textAlign = 'right';
    
    //if(align & 2)
        //context.textBaseline = 'middle';
    //else
        context.textBaseline = 'top';

    context.fillStyle = '#' + toHex(r) + toHex(g) + toHex(b);

    //str = str.replace(/\n/gi, "<br>");

    //context.fillText(str, x, y);
    drawTextBox(context, str, x, y, width, 1.1);
}


startGame = () => {
    canvas = document.getElementById('main_canvas');
    context = canvas.getContext("2d");
    context.font = "40px sans-serif";
    context.textBaseline = "top";

    //context.scale(2, 2);

    canvasList.push(canvas);
    contextList.push(context);

    setTimeout(() => loadScript('test.js'), 1000);
};

keyboardQueue = new Queue();

document.addEventListener('keydown', (event) => {
    // if(event.keyCode == 37) {
    //     alert('Left was pressed');
    // }
    // else if(event.keyCode == 39) {
    //     alert('Right was pressed');
    // }
    //console.log(event.key);

    if(event.key == "ArrowUp")
        keyboardQueue.enqueue(72);
    else if(event.key == "ArrowLeft")
        keyboardQueue.enqueue(75);
    else if(event.key == "ArrowRight")
        keyboardQueue.enqueue(77);
    else if(event.key == "ArrowDown")
        keyboardQueue.enqueue(80);
    else if(event.key == "Enter")
        keyboardQueue.enqueue(0x0d);
    else if(event.key == "Escape")
        keyboardQueue.enqueue(0x1b);
    else if(event.key == "Space")
        keyboardQueue.enqueue(0x20);
    else
        keyboardQueue.enqueue(event.key.charCodeAt(0));
});

const _kbhit = () => {
    return keyboardQueue.empty() ? 0 : 1;
}

const _getch = () => {
    let now = keyboardQueue.front();
    keyboardQueue.dequeue();

    return now;
}

function onStartButtonClicked() {
    startGame();

    //document.getElementById('main_canvas').style.display = 'block';

    document.getElementById('start').style.visibility = 'hidden';
    document.getElementById('start').style.display = 'none';
    document.getElementById('button_div').style.display = 'none';
}