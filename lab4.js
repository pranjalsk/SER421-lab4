// Input parameters
// 6 suspects
var suspects = ['Mrs. Peacock', 'Mrs. Green', 'Miss Scarlet', 'Colonel Mustard', 'Professor Plum', 'Madame Rose'];

//6 weapons
var weapons = ['Pistol', 'Knife', 'Wrench', 'LeadPipe', 'Candlestick', 'Poison'];

//9 rooms
var rooms = ['Kitchen', 'Ballroom', 'Conservatory',
    'BilliardRoom', 'Study', 'Lounge',
    'LivingRoom', 'DiningRoom', 'Library'
]

var historyCards = [];
var murderSecret = [];
prepopulateMenuOption();
var username = '';

//Record Ledger
var recordLedger = [];

//Display input to User
suspects.forEach(function (suspect) {
    document.getElementById('suspects-placeholder').innerHTML += suspect + ", ";
});
weapons.forEach(function (weapon) {
    document.getElementById('weapons-placeholder').innerHTML += weapon + ", ";
});
rooms.forEach(function (room) {
    document.getElementById('rooms-placeholder').innerHTML += room + ", ";
});

function secretMurder() {
    let secret = [suspects[Math.floor(Math.random() * suspects.length)],
        weapons[Math.floor(Math.random() * weapons.length)],
        rooms[Math.floor(Math.random() * rooms.length)]
    ];
    //secret is...
    console.log(secret[0] + " used " + secret[1] + " for murder in the " + secret[2]);
    return secret;
}

// Distribute cards to user and computer
var totalDeckCards = suspects.length + weapons.length + rooms.length; //(2n+3)
var cardsPerUser = Math.floor((totalDeckCards - 3) / 2);
var userCards = [];
var compCards = [];

function distributeCards() {
    let suspectsWithoutSecret = suspects.filter(function (x) {
        return x !== murderSecret[0];
    });
    let weaponsWithoutSecret = weapons.filter(function (x) {
        return x !== murderSecret[1];
    });
    let roomsWithoutSecret = rooms.filter(function (x) {
        return x !== murderSecret[2];
    });

    let combinedWithoutSecret = suspectsWithoutSecret.concat(weaponsWithoutSecret, roomsWithoutSecret);

    //shuffle the array using Fisher-Yates Shuffle Algorithm
    let shuffledWithoutSecret = shuffle(combinedWithoutSecret);
    console.log("Cards in deck: ");
    console.log(shuffledWithoutSecret);

    //distribute cards into halves
    userCards = shuffledWithoutSecret.slice(0, cardsPerUser);
    compCards = shuffledWithoutSecret.slice(cardsPerUser);

    let filteredSuspects = filterMe(suspects, userCards);
    let filteredWeapons = filterMe(weapons, userCards);
    let filteredRooms = filterMe(rooms, userCards);

    populateMenu('suspects-option', filteredSuspects);
    populateMenu('weapons-option', filteredWeapons);
    populateMenu('rooms-option', filteredRooms);
}



//Guess button event
document.getElementById('guess-button').addEventListener('click', function (e) {
    e.preventDefault();
    let selectedSuspect = getSelectedValue('suspects-option');
    let selectedWeapon = getSelectedValue('weapons-option');
    let selectedRoom = getSelectedValue('rooms-option');
    let selectedOptionsArr = [selectedSuspect, selectedWeapon, selectedRoom];

    //push into history
    historyCards.push(selectedOptionsArr);

    if (selectedSuspect === murderSecret[0] &&
        selectedWeapon === murderSecret[1] &&
        selectedRoom === murderSecret[2]) {
        console.log("I won");

        //Place record into ledger
        insertRecord(username,username);

        document.getElementById('continue-placeholder').innerHTML = `
        <p> That was the correct guess! ` + selectedSuspect + ` did it with the ` + selectedWeapon + ` in the ` + selectedRoom + `!</br>
        Click to start a new game: </p>`;
        let getElement = createNewButton('button', 'New game', 'reset-button');
        document.getElementById('continue-placeholder').appendChild(getElement);
    } else {
        console.log("I did not win");
        let compHasCards = selectedOptionsArr.filter(function (ele) {
            return compCards.includes(ele);
        });
        let showCard = compHasCards[Math.floor(Math.random() * compHasCards.length)];
        console.log(showCard);
        document.getElementById('continue-placeholder').innerHTML = `
        <p>Sorry that was an incorrect guess! The Computer holds the card for <b>` + showCard + `</b>.<br/>
        Click to continue: </p> `;
        let getElement = createNewButton('button', 'continue', 'continue-button');
        document.getElementById('continue-placeholder').appendChild(getElement);

        let guessBtn = document.getElementById('guess-button');
        guessBtn.disabled = !guessBtn.disabled;
    }
});


//Continue button event listener
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'continue-button') {
        e.preventDefault();
        let compfilteredSuspects = filterMe(suspects, compCards);
        let compfilteredWeapons = filterMe(weapons, compCards);
        let compfilteredRooms = filterMe(rooms, compCards);

        var compGuess = [compfilteredSuspects[Math.floor(Math.random() * compfilteredSuspects.length)],
            compfilteredWeapons[Math.floor(Math.random() * compfilteredWeapons.length)],
            compfilteredRooms[Math.floor(Math.random() * compfilteredRooms.length)]
        ];

        //push into history
        historyCards.push(compGuess);

        if (compGuess[0] === murderSecret[0] &&
            compGuess[1] === murderSecret[1] &&
            compGuess[2] === murderSecret[2]) {

            console.log("Computer won");
            //Place record into ledger
            insertRecord('Computer','Computer');    
            
            document.getElementById('continue-placeholder').innerHTML = `
                <p> That was the correct guess! ` + compGuess[0] + ` did it with the ` + compGuess[1] + ` in the ` + compGuess[2] + `!</br>
                Click to start a new game: </p>`;
        } else {
            let userHasCards = compGuess.filter(function (ele) {
                return userCards.includes(ele);
            });
            let showCard = userHasCards[Math.floor(Math.random() * userHasCards.length)];
            console.log(showCard);
            document.getElementById('continue-placeholder').innerHTML =
                `<p>The Computer guessed "` + compGuess[0] + ` in the ` + compGuess[2] + ` with a ` + compGuess[1] + `"<br/>
                The Computer made an incorrect guess! You holds the card for <b>` + showCard + `</b>.<br/>
                Click to continue: </p>`;
            let getElement = createNewButton('button', 'Continue', 'comp-continue-button');
            document.getElementById('continue-placeholder').appendChild(getElement);
        }
    }
});

//computer-continue button event listener
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'comp-continue-button') {
        let guessBtn = document.getElementById('guess-button');
        guessBtn.disabled = !guessBtn.disabled;
        console.log('cont clicked');
        document.getElementById('continue-placeholder').innerHTML = ``;
    }
});


//reset button event listener
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'reset-button') {
        console.log('reset clicked');
        document.getElementById("userinfo-placeholder").innerHTML = '';
        document.getElementById("continue-placeholder").innerHTML = '';
        document.getElementById("history-placeholder").innerHTML = '';
        document.getElementById('history-button').value = "Show History";
        username = '';
        
        resetMenuOptions();
        prepopulateMenuOption();
        historyCards = [];
        
        //New player form
        document.getElementById("user-form-div").innerHTML = `
        <FORM>
        Name:
        <input id="user-name" type="text" value="name here" autofocus="true" />
        <input id="enter-button" type="button" value="Enter" />
        </FORM>`;
        let guessBtn = document.getElementById('guess-button');
        guessBtn.disabled = true;

        murderSecret = secretMurder();
        distributeCards();
    }
});


//Enter Button event listener
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'enter-button') {
        console.log('enter clicked');

        //create new secret murder combination = suspect + weapon + room & distribute cards
        resetMenuOptions();
        murderSecret = secretMurder();
        distributeCards();

        username = document.getElementById('user-name').value;
        document.getElementById('user-form-div').innerHTML = ``;
        document.getElementById('userinfo-placeholder').innerHTML = `
            <p>Hello <b>` + username + `,</b> you hold the cards: <i>` + userCards.toString() + `</i></p>`;
        let guessBtn = document.getElementById('guess-button');
        guessBtn.disabled = !guessBtn.disabled;
    }
});


//history button event listener
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'history-button') {
        console.log(historyCards);
        document.getElementById('history-placeholder').innerHTML = '';
        historyCards.forEach(function (historyCard) {
            document.getElementById('history-placeholder').innerHTML += "<div>[" + historyCard + "]</div>";
        });

        //toggle display logic
        let x = document.getElementById("history-placeholder");
        if (x.style.display === "none") {
            x.style.display = "block";
            document.getElementById('history-button').value = "Hide History";
        } else {
            x.style.display = "none";
            document.getElementById('history-button').value = "Show History";
        }
    }
});

//Records button event listner
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'record-button') {
        console.log(recordLedger);
        document.getElementById('record-placeholder').innerHTML = '';
        
        recordLedger.forEach(function (record) {
            //let recordStr = '<Player1:'+record.player1+'--Player2:'+record.player2+'--Date:'+record.date+'--Won By:'+record.wonBy+'>';
            let recordStr = JSON.stringify(record);
            document.getElementById('record-placeholder').innerHTML += "<div>[" + recordStr + "]</div>";
        });

        //toggle display logic
        let x = document.getElementById("record-placeholder");
        if (x.style.display === "none") {
            x.style.display = "block";
            document.getElementById('record-button').value = "Hide Record";
        } else {
            x.style.display = "none";
            document.getElementById('record-button').value = "Show Record";
        }
    }
});















































//------------------------------------- Helper Functions -------------------------------------------

//Filter options menu -- compare two arrays to return only array with non-inclusive cards
function filterMe(array, cards) {
    return array.filter(function (ele) {
        return !cards.includes(ele);
    });
}

//To create new button element
function createNewButton(type, value, elementId) {
    var element = document.createElement("input");
    element.id = elementId;
    element.type = type;
    element.value = value;
    return element;
}

//To get selected value from the selection-box
function getSelectedValue(elementId) {
    let ele = document.getElementById(elementId);
    return ele.options[ele.selectedIndex].value;
}

function prepopulateMenuOption() {
    //Prepopulate Menu with:
    populateMenu('suspects-option', suspects);
    populateMenu('weapons-option', weapons);
    populateMenu('rooms-option', rooms);
}


// Populate selection-box options
function populateMenu(elementId, array) {
    let Options = document.getElementById(elementId);
    for (let i = 0; i < array.length; i++) {
        let opt = document.createElement('option');
        opt.innerHTML = array[i];
        opt.value = array[i];
        opt.setAttribute("class", elementId + "-menu");
        Options.appendChild(opt);
    }
}

//reset Menu option 
function resetMenuOptions() {
    document.getElementById("suspects-option").innerHTML = '';
    document.getElementById("weapons-option").innerHTML = '';
    document.getElementById("rooms-option").innerHTML = '';
}

//Shuffle algorithm -  Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function insertRecord(user, wonBy){
    let record = {  player1:'Computer',
                    player2: user,
                    date: new Date().toLocaleString(),
                    wonBy: wonBy 
    }
    recordLedger.push(record);
}