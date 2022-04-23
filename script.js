
var current_row = 1;
var current_letter = 0;

var game = true
var solution = possibe_answers[Math.floor(Math.random() * possibe_answers.length)]

alert('You are playing on a remake of WORDLE: \nhttps://www.nytimes.com/games/wordle/index.html\nPlay the real game first!')


var revealing_answer = false
// Executed when a letter is added
function addletter(letter) {
    if(revealing_answer == true){
        return;
    }
    if(letter =='Enter' && game==false){ // If they press restart game
        game = true
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
        enter_button.removeAttribute('style');
        enter_button.innerHTML = 'ENTER';

        for (var i = 1; i <= 6; i++) {
            for (var x = 1; x <= 5; x++) {
                var div = document.getElementById(`tile-${i}-${x}`);
                div.textContent= ' '
                div.setAttribute("data-state", "empty");
                div.setAttribute("tile-animation", "idle");
                div.removeAttribute('tile-information')
            }
        }
        var alphabet = 'qwertyuiopasdfghjklzxcvbnm'
        for (var x = 0; x < alphabet.length; x++){
            var c = alphabet.charAt(x);
            var keyboard_key = document.getElementById(`keyboard-button-${c}`)
            keyboard_key.removeAttribute('tile-information')
        }
        solution = possibe_answers[Math.floor(Math.random() * possibe_answers.length)]
        message_active = false;
        current_row = 1;
        current_letter = 0;
        return;
    }
    if(letter.length === 1 && letter.match(/[a-z]/i)){
        if(current_letter <= 4){
            current_letter ++
            var element = document.getElementById(`tile-${current_row}-${current_letter}`)
            element.setAttribute('tile-animation', 'enter');
            element.setAttribute('tile-information', 'tbd');
            element.textContent=`${letter}`;
        }
    } else if(letter=='Backspace'){
        if(current_letter > 0){
            var element = document.getElementById(`tile-${current_row}-${current_letter}`)
            element.setAttribute('tile-animation', 'idle');
            element.setAttribute('tile-information', 'empty');
            element.textContent=` `;
            current_letter --
        }
    } else if(letter="Enter") {
        guess = ""
        for (let i = 1; i < 6; i++) {
            var span = document.getElementById(`tile-${current_row}-${i}`)
            if (span.textContent != " "){
                guess += span.textContent
            }
        }
        if (guess.length != 5){
            row = document.getElementById(`game-row-${current_row}`)
            row.setAttribute('shake', 'true');
            send_message('Not enough letters.');
            setTimeout(() => {  row.removeAttribute('shake') }, 1000);
            return;
        } 
        if(possible_words.includes(guess) == false){
            row = document.getElementById(`game-row-${current_row}`)
            row.setAttribute('shake', 'true');
            send_message('Not in word list.');
            setTimeout(() => {  row.removeAttribute('shake') }, 1000);
            return;
        }
        

        var correct_amount = 0;
        var i = 0, howManyTimes = 5;
        revealing_answer = true;
        var submission_dict = {};
        function f() {
            let guessLetter = guess.charAt(i);
            let solutionLetter = solution.charAt(i);
            var span = document.getElementById(`tile-${current_row}-${i+1}`);
            span.setAttribute('tile-animation', 'rotate-stage-1');

            if (guessLetter === solutionLetter) { // Green
                setTimeout(() => {  span.setAttribute('tile-information', 'correct'); span.setAttribute('tile-animation', 'rotate-stage-2'); }, 250);
                submission_dict[guessLetter] = 'correct'
                correct_amount ++
            }
            else if (solution.indexOf(guessLetter) != -1) { // Yellow
                setTimeout(() => {  span.setAttribute('tile-information', 'present'); span.setAttribute('tile-animation', 'rotate-stage-2'); }, 250);
                submission_dict[guessLetter] = 'present'
            }
            else { // Gray
                submission_dict[guessLetter] = 'absent'
                setTimeout(() => {  span.setAttribute('tile-information', 'absent'); span.setAttribute('tile-animation', 'rotate-stage-2'); }, 250);
            } 
            i++;
            if (i < howManyTimes) {
              setTimeout(f, 250);
            } else {
                enter_button = document.getElementById(`keyboard-button-enter`)
                if(correct_amount == 5){ // ending game by getting correct guess
                    setTimeout(() => {  
                        game = false
                        send_message('You Won!');
                        enter_button.setAttribute('style', 'background-color: #080705; color: #ffffff;');
                        enter_button.innerHTML = 'PLAY';
                        revealing_answer = false
                    }, 750);
                    return;
                } else if (current_row == 6){ // end game by running out of guesses
                    setTimeout(() => {  
                        game = false
                        send_message(solution.toUpperCase());
                        enter_button.setAttribute('style', 'background-color: #080705; color: #ffffff;');
                        enter_button.innerHTML = 'PLAY';
                        revealing_answer = false
                    }, 750);
                }

                revealing_answer = false;
                current_row ++
                 current_letter = 0
                setTimeout(() => {  
                    for (const [key, value] of Object.entries(submission_dict)) {
                        document.getElementById(`keyboard-button-${key}`).setAttribute("tile-information", value);
                    }
                }, 300);
                
                  
            }
          }
          
        f();


        
    }
}


// Checks for when keyboard is pressed and runs addletter 
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    var str = e.key;
    if(e.isTrusted == true && e.ctrlKey == false){
        if(str.length === 1 && str.match(/[a-z]/i)){
            addletter(str);
        } else if(str == "Enter" || str == "Backspace") {
            addletter(str);
        }
    }
}


var message_active = false;

function send_message(text) {
    if(message_active == false){
        message_active = true;
        document.getElementById("myPopup").textContent = text;
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
        if(game == true) {
            setTimeout(() => {  
                popup.classList.toggle("show"); 
                message_active = false;
            }, 2000);
        }
    }

    
  }