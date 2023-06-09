let arr = []; // empty array for storing the images
let pairs = 8; // 4x4 table with 16 images, 8 pairs

//Getting the file path, so that later this code works for all 3 games
let path = window.location.pathname;
let page = path.split("/").pop();

//to set up the photos in the photoObj later
if (page == 'game-animals.html') {
    page = 'animals';
}
else if (page == 'game-fruits.html') {
    page = 'fruits';
}
else if (page == 'game-shapes.html') {
    page = 'shapes';
}

// setting every photo with id number and the path (every photo has number 1-8)
let photoObj = {
    1: 'photos/' + page + '/1.webp', // this is how we get the path to the image
    2: 'photos/' + page + '/2.webp',
    3: 'photos/' + page + '/3.webp',
    4: 'photos/' + page + '/4.webp',
    5: 'photos/' + page + '/5.webp',
    6: 'photos/' + page + '/6.webp',
    7: 'photos/' + page + '/7.webp',
    8: 'photos/' + page + '/8.webp'
}

let startButton = document.querySelector('#start-button');
startButton.addEventListener('click', startGame);
let timerDisplay = document.querySelector('#time-button');

let timer; // declaring timer variable used when START button is being clicked
let time; // i must declare it here because im using it when game is over down in function endGame

// Starting the game
function startGame() {
    resetGame(true); // always shuffle before starting
    startButton.disabled = true; // once playing you cant click on the start button

    //timer going from 60 to 0 seconds
    time = 60;
    timer = setInterval(function () {
        time--;
        timerDisplay.textContent = 'Time: ' + time + ' sec';
        if (time < 0) {
            alert('Game over, time is up! YOU LOST.\nTry again, press start...');
            clearInterval(timer);
            timerDisplay.textContent = 'Time: 0 sec'; // this is hardcoded but i dont know why it ended at 01sec :)
            resetGame(false);
        }
    }, 1000);
}

//makes the random numbers for the images and positions
function randomize() {
    for (let i = 0; i <= 15; i++) {
        arr[i] = 0;
    }
    for (let i = 0; i <= 15; i++) {
        var random = Math.floor(Math.random() * 8) + 1;
        while (!check(random)) {
            random = Math.floor(Math.random() * 8) + 1;
        }
        arr[i] = random;
    }
}

// sets the images from the photoObj above
function imageAtt(first) {
    let imgs = document.querySelectorAll('img');
    for (let i = 0; i <= 15; i++) {
        imgs[i].src = photoObj[arr[i]];
        imgs[i].style.opacity = '0%'; // making them not visible
        imgs[i].className = ''; // MUST!!! removing the class
        if (!first) {
            imgs[i].style.pointerEvents = 'none'; // not clickable
        } else {
            imgs[i].style.pointerEvents = 'auto'; // clickable
        }
    }
}

// Reset
function resetGame(first) {
    clearInterval(timer); // must clear the time
    startButton.disabled = false; // now you can click on START button
    timerDisplay.textContent = 'Time: 60 sec';
    pairs = 8;
    randomize();
    imageAtt(first);
}

// checks if more than 2 are same
function check(random) {
    let counter = 0;
    for (let j = 0; j <= 15; j++) {
        if (random == arr[j]) {
            counter++;
        }
    }
    if (counter >= 2) {
        return false;
    }
    return true;
}

let imgs = document.querySelectorAll('img');
for (let i = 0; i <= 15; i++) {
    imgs[i].addEventListener('click', function () { // eventListener on the td we click
        let correct = 0;
        this.style.opacity = '100%'; // view the image
        for (let img of imgs) { // go trough all images
            if (img.className == 'opened' && img.id != this.id) { // check if the class is opened and clicked id with other not same
                if (this.src == img.src) { // if on both source is the same make their classes correct
                    img.className = 'correct';
                    this.className = 'correct';
                    correct++;
                    endGame();
                } else { // remove class
                    this.className = '';
                    img.className = '';
                    correct--;
                    for (let img of imgs) {
                        img.style.pointerEvents = 'none'; // making them not clickable
                    }
                    setTimeout(() => {
                        img.style.opacity = '0%'; // making it not visible
                        this.style.opacity = '0%';
                        for (let img of imgs) {
                            if (img.className != 'correct') {
                                img.style.pointerEvents = 'auto'; // now enable clicking
                            }
                        }
                    }, 1000);
                }//end of else for removing class
            }
        }//end of loop going trough all images
        if (correct == 0) {
            this.className = 'opened';
        }
    }); // end of eventListener
}//end of outer loop

// endgame function checking if pairs are all done and decreasing the value starting from 8
function endGame() {
    pairs--;
    if (pairs <= 0) { // Activate when all pairs are completed and alert Winner
        setTimeout(() => {
            alert('Congratulations on your awesome win!\nYou finished the game in '+(60-time)+' seconds!');
            resetGame(false);
        }, 500);
    }
}