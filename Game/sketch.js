async function loadWords() {
    const response = await fetch("./words.json");
    return await response.json();
}

var data;

var clickSound;
var answerArray = [];

var counter = 0;

var gameState = "play";

function preload() {
    clickSound = loadSound("sound/clickbutton.mp3");
}

async function setup() {
    var words = await loadWords();
    data = words[Math.floor(Math.random() * words.length)];

    createCanvas(windowWidth, windowHeight);

    fill(255, 255, 255, 40);
    stroke("black");
    strokeWeight(1);
    rect(windowWidth / 2.9, windowHeight / 1.85, 587, 170, 20);

    var b = [];
    var button = [];

    for (var i = 0; i < 26; i++) {
        button[i] = String.fromCharCode(65 + i);
    }

    var fix_x = windowWidth / 2.8;
    var x = fix_x;
    var y = windowHeight / 1.8;
    for (var i = 0; i < 26; i++) {
        b[i] = createButton(button[i]);
        b[i].size(40, 40);
        b[i].addClass("keys");
        b[i].position(x, y);

        x += 50;
        if (i == 10 || i == 21) {
            y += 50;
            x = fix_x;
        }
        if (i == 21) {
            x = fix_x + 175;
        }
    }

    for (let i = 0; i < 26; i++) {
        b[i].mousePressed(() => {
            checkLetter(button[i], b[i]);
        });
    }

    hint_b = createButton("Hint ?");
    hint_b.size(60, 40);
    hint_b.addClass("hint-button");
    hint_b.position(windowWidth / 2.8, windowHeight / 4);
    hint_b.mousePressed(() => {
        if (gameState != "end") {
            hint();
            hint_b.attribute("disabled", "true");

            clickSound.play();
        } else {
            clickSound.stop();
        }
    });

    for (var j = 0; j < data.word.length; j++) {
        fill("white");
        stroke("white");
        strokeWeight(4);
        text("___", (j * 30) + windowWidth / 2.8, windowHeight / 2);
    }
}

function draw() {
    var fixed_x = windowWidth / 2.8;
    var fixed_y = windowHeight / 20;

    stroke("white");
    strokeWeight(7);
    line(fixed_x + 250, fixed_y + 100, fixed_x + 250, fixed_y + 350); // gallows
    line(fixed_x + 250, fixed_y + 100, fixed_x + 300, fixed_y + 100); // top line
    line(fixed_x + 200, fixed_y + 350, fixed_x + 350, fixed_y + 350); // base line
    line(fixed_x + 300, fixed_y + 100, fixed_x + 300, fixed_y + 135); // rope
}

function hint() {
    if (gameState == "play") {
        fill("white");
        strokeWeight(1);
        textSize(20)
        text("Hint : " + data.hint, windowWidth / 2.8, windowHeight / 1.33);
    }
}

function checkLetter(r, b) {
    if (gameState == "play") {
        b.attribute("disabled", "true");
        counter++;
        
        for (var i = 0; i < data.word.length; i++) {
            clickSound.play();

            if (r === data.word[i]) {
                counter--;
                fill("white");
                noStroke();
                textSize(24);
                text(r, (i * 30) + windowWidth / 2.8, windowHeight / 2.01);
                answerArray[i] = r;
            }
        }

        var fixed_x = windowWidth / 2.8;
        var fixed_y = windowHeight / 20;
        
        fill("white");
        if (counter == 1) {
            noFill();
            circle(fixed_x + 300, fixed_y + 160, 50);
        } else if (counter == 2) {
            line(fixed_x + 300, fixed_y +  185, fixed_x +  300, fixed_y +  260);
        } else if (counter == 3) {
            line(fixed_x + 300, fixed_y +  195, fixed_x +  280, fixed_y +  250);
        } else if (counter == 4) {
            line(fixed_x + 300, fixed_y +  195, fixed_x +  320, fixed_y +  250);
        } else if (counter == 5) {
            line(fixed_x + 300, fixed_y +  255, fixed_x +  280, fixed_y +  320);
        } else if (counter == 6) {
            line(fixed_x + 300, fixed_y +  255, fixed_x +  320, fixed_y +  320);
        }
        
        if (counter >= 6) {
            fill("red");
            textSize(48);
            strokeWeight(3);
            stroke("white");
            text("YOU LOST", windowWidth / 2.27, windowHeight / 15);
            textSize(24);
            text("ANSWER : " + data.word, windowWidth / 2.3, windowHeight / 1.2);

            reload_button = createButton("Play Again ?");
            reload_button.size(100, 40);
            reload_button.addClass("play-again-button");
            reload_button.position(windowWidth / 2.1, windowHeight / 1.15);
            reload_button.mousePressed(() => {
                if (gameState == "end") {
                    location.reload();   
                    clickSound.play();
                }
            });
            hint_b.attribute("disabled", "true");

            gameState = "end";
        }
    }
    
    var x = answerArray.join("");
    if (x == data.word) {
        fill("blue");
        textSize(48);
        strokeWeight(3);
        stroke("white");
        text("YOU WON", windowWidth / 2.25, windowHeight / 15);

        reload_button = createButton("Play Again ?");
        reload_button.size(100, 40);
        reload_button.addClass("play-again-button");
        reload_button.position(windowWidth / 2.1, windowHeight / 1.15);
        reload_button.mousePressed(() => {
            if (gameState == "end") {
                location.reload();   
                clickSound.play();
            }
        });
        hint_b.attribute("disabled", "true");

        gameState = "end";
    }
}

if (gameState == "end") {
    clickSound.stop();
}