var Blackjack = function () {
    const NUMBER_OF_CARDS = 52;

    function generateCard() {
        var cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'K', 'Q', 'A'];
        var paints = ['C', 'D', 'H', 'S'];
        var card = Math.floor(Math.random() * cards.length);
        var paint = Math.floor(Math.random() * paints.length);
        return cards[card] + paints[paint];
    }

    // canvas element used for animation of every single card
    function createCanvas(endPositionX, endPositionY) {
        var canvas = document.createElement('canvas');
        canvas.id = 'canvas' + endPositionX + endPositionY;
        canvas.className = 'card';
        document.getElementById('wrapper').appendChild(canvas);
        return canvas;
    }

    // load new card from the deck with animation
    function showCard(endPositionX, endPositionY, cardValue, canChange) {
        var canvas = createCanvas(endPositionX, endPositionY);
        var context = canvas.getContext('2d');
        var x = canvas.width + endPositionX;
        var y = 0;
        var speed = 4;
        var card = new Image();
        card.src = "./assets/Simple Back.png";
        card.onload = animate;

        function animate() {
            if (x > endPositionX) {
                x -= speed;
            }
            if (y < endPositionY) {
                y += speed;
            }
            context.clearRect(0, 0, innerWidth, innerHeight);  
            context.drawImage(card, x, y, 50, 70);           

            if (x > endPositionX || y < endPositionY) {
                requestAnimationFrame(animate);
            } else {
                var image = document.createElement('img');
                image.src = "./cards_png/" + cardValue + ".png";
                image.id = 'card' + endPositionX + endPositionY;
                image.setAttribute('class', 'card');
                image.style.left = 45 + endPositionX/13+ '%';
                image.style.top = 22 + endPositionY/6 + '%';

                image.style.zIndex = endPositionX;
                if (canChange) {
                    image.onclick = function () { changeCard(endPositionX, endPositionY); };
                }
                var canvasDom = document.getElementById('canvas' + endPositionX + endPositionY);
                document.getElementById('wrapper').removeChild(canvasDom);
                document.getElementById('wrapper').appendChild(image);
            }
        }

    }

    // show game over message and prevent all actions different than 'New game'
    function gameOver() {
        if (document.getElementById('card1080')) {
            document.getElementById('card1080').onclick = function () { return; };
        }
        if (document.getElementById('card3080')) {
            document.getElementById('card3080').onclick = function () { return; };
        }
        document.getElementById('btnHit').setAttribute("disabled", "disabled");
        if (!document.getElementById('gameOver')) {
            var gameOver = document.createElement('div');
            gameOver.innerText = 'Game Over!';
            gameOver.className = 'gameOver';
            gameOver.id = 'gameOver';
            document.getElementById('wrapper').appendChild(gameOver);
        }
    }

    // remove all cards from previous game and verify the button 'Hit' is enabled
    function clear() {
        var wrapper = document.getElementById('wrapper');
        var divs = wrapper.querySelectorAll('div');

        if (wrapper.querySelectorAll('img').length == 1) {
            return;
        }
        document.getElementById('wrapper').removeChild(document.getElementById('card00'));
        document.getElementById('wrapper').removeChild(document.getElementById('card200'));
        document.getElementById('wrapper').removeChild(document.getElementById('card400'));
        document.getElementById('wrapper').removeChild(document.getElementById('card1080'));
        document.getElementById('wrapper').removeChild(document.getElementById('card3080'));
        document.getElementById('btnHit').removeAttribute("disabled");
        if (document.getElementById('gameOver')) {
            document.getElementById('wrapper').removeChild(document.getElementById('gameOver'));
        }
    }

    // generate new card. used by button 'Hit' or onclick event for card
    function changeCard(cardX, cardY) {
        if (cards.size == NUMBER_OF_CARDS) {
            gameOver();
            return false;
        }
        var cardId = 'card' + cardX + cardY; // unique id for the card on this position
        document.getElementById('wrapper').removeChild(document.getElementById(cardId));
        var originalSize = cards.size;
        var cardImg;
        while (cards.size == originalSize) { // exits when new unique card is generated
            cardImg = generateCard();
            cards.add(cardImg);
        }
        showCard(cardX, cardY, cardImg, true);
        return true;
    }

    // handle onclick for button 'Hit'
    function hit() {
        changeCard(10, 80);
        changeCard(30, 80);
    }

    clear();
    var cards = new Set();
    while (cards.size < 5) {
        cards.add(generateCard());
    }

    var game = cards.values();

    showCard(0, 0, game.next().value);
    showCard(20, 0, game.next().value);
    showCard(40, 0, game.next().value);

    showCard(10, 80, game.next().value, true);
    showCard(30, 80, game.next().value, true);

    document.getElementById('btnHit').onclick = hit;
};

var game = new Blackjack();

// handle onclick for button 'New game'
function newGame() {
    game = new Blackjack();
}
