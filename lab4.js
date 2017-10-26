// Input parameters
// 6 suspects
suspects = ['Mrs. Peacock', 'Mrs. Green', 'Miss Scarlet', 'Colonel Mustard', 'Professor Plum', 'Madame Rose'];

//6 weapons
weapons = ['Pistol', 'Knife', 'Wrench', 'LeadPipe', 'Candlestick', 'Poison'];

//9 rooms
rooms = ['Kitchen', 'Ballroom', 'Conservatory',
    'BilliardRoom', 'Study', 'Lounge',
    'LivingRoom', 'DiningRoom', 'Library'
]

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


//create new a murder combination = suspect + weapon + room
var murderSecret = [suspects[Math.floor(Math.random() * suspects.length)],
    weapons[Math.floor(Math.random() * weapons.length)],
    rooms[Math.floor(Math.random() * rooms.length)]
];
//secret is...
console.log(murderSecret[0] + " used " + murderSecret[1] + " for murder in the " + murderSecret[2]);

// Distribute cards to user and computer
var totalDeckCards = suspects.length + weapons.length + rooms.length; //(2n+3)
var cardsPerUser = Math.floor((totalDeckCards - 3) / 2);

var suspectsWithoutSecret = suspects.filter(function (x) {
    return x !== murderSecret[0];
});
var weaponsWithoutSecret = weapons.filter(function (x) {
    return x !== murderSecret[1];
});
var roomsWithoutSecret = rooms.filter(function (x) {
    return x !== murderSecret[2];
});

var combinedWithoutSecret = suspectsWithoutSecret.concat(weaponsWithoutSecret, roomsWithoutSecret);

//shuffle the array using Fisher-Yates Shuffle Algorithm
var shuffledWithoutSecret = shuffle(combinedWithoutSecret);
console.log(shuffledWithoutSecret);

//distribute cards into halves
var userCards = shuffledWithoutSecret.slice(0, cardsPerUser);
var compCards = shuffledWithoutSecret.slice(cardsPerUser);

//Filter options menu 
function filterMe(array, cards) {
    return array.filter(function (ele) {
        return !cards.includes(ele);
    });
}
var filteredSuspects = filterMe(suspects, userCards);
var filteredWeapons = filterMe(weapons, userCards);
var filteredRooms = filterMe(rooms, userCards);

populateMenu('suspects-option', filteredSuspects);
populateMenu('weapons-option', filteredWeapons);
populateMenu('rooms-option', filteredRooms);

function populateMenu(elementId, array) {
    let Options = document.getElementById(elementId);
    for (var i = 0; i < array.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = array[i];
        opt.value = array[i];
        opt.setAttribute("class", elementId + "-menu");
        Options.appendChild(opt);
    }
}

//Guess button event
var guessButton = document.getElementById('guess-button');

function getSelectedValue(elementId) {
    let ele = document.getElementById(elementId);
    return ele.options[ele.selectedIndex].value;
}

guessButton.addEventListener('click', function (e) {
    e.preventDefault();
    let selectedSuspect = getSelectedValue('suspects-option');
    let selectedWeapon = getSelectedValue('weapons-option');
    let selectedRoom = getSelectedValue('rooms-option');
    let selectedOptionsArr = [selectedSuspect, selectedWeapon, selectedRoom];

    if (selectedSuspect === murderSecret[0] &&
        selectedWeapon === murderSecret[1] &&
        selectedRoom === murderSecret[2]) {
        console.log("I won");
        document.getElementById('continue-placeholder').innerHTML = `
        <p> That was the correct guess! ` + selectedSuspect + ` did it with the ` + selectedWeapon + ` in the ` + selectedRoom + `!</br>
        Click to start a new game: </p>`;
        let getElement = createNewButton('button', 'New game', 'reset-button');
        document.getElementById('continue-placeholder').appendChild(getElement);
    } 
    else {
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

function createNewButton(type, value, elementId) {
    var element = document.createElement("input");
    element.id = elementId;
    element.type = type;
    element.value = value;
    return element;
}

//Continue button event listener
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'continue-button') {
        e.preventDefault();
        let compfilteredSuspects = filterMe(suspects, compCards);
        let compfilteredWeapons = filterMe(weapons, compCards);
        let compfilteredRooms = filterMe(rooms, compCards);

        var compGuessSuspect = [compfilteredSuspects[Math.floor(Math.random() * compfilteredSuspects.length)],
            compfilteredWeapons[Math.floor(Math.random() * compfilteredWeapons.length)],
            compfilteredRooms[Math.floor(Math.random() * compfilteredRooms.length)]
        ];
        console.log(compGuessSuspect);

        if (compGuessSuspect[0] === murderSecret[0] &&
            compGuessSuspect[1] === murderSecret[1] &&
            compGuessSuspect[2] === murderSecret[2]) {
            document.getElementById('continue-placeholder').innerHTML = `
                <p> That was the correct guess! ` + compGuessSuspect[0] + ` did it with the ` + compGuessSuspect[1] + ` in the ` + compGuessSuspect[2] + `!</br>
                Click to start a new game: </p>`;
        } 
        else {
            let userHasCards = compGuessSuspect.filter(function (ele) {
                return userCards.includes(ele);
            });
            let showCard = userHasCards[Math.floor(Math.random() * userHasCards.length)];
            console.log(showCard);
            document.getElementById('continue-placeholder').innerHTML =
                `<p>The Computer guessed "` + compGuessSuspect[0] + ` in the ` + compGuessSuspect[2] + ` with a ` + compGuessSuspect[1] + `"<br/>
                The Computer made an incorrect guess! You holds the card for <b>`+showCard+`</b>.<br/>
                Click to continue: </p>`;
            let getElement = createNewButton('button', 'Continue', 'comp-continue-button');
            document.getElementById('continue-placeholder').appendChild(getElement);
        }

    }
});

//computer continue preseed
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
    }
});


//Enter Button clicked
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'enter-button') {
        console.log('enter clicked');
        let username = document.getElementById('user-name').value;
        document.getElementById('user-form-div').innerHTML = ``;
        document.getElementById('userinfo-placeholder').innerHTML = `
            <p>Hello <b>`+ username+`,</b> you hold the cards: <i>`+ userCards.toString() +`</i></p>`;
        let guessBtn = document.getElementById('guess-button');
        guessBtn.disabled = !guessBtn.disabled;
    }
});





























































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