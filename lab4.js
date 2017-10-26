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
function filterMe(array) {
    return array.filter(function (ele) {
        return !userCards.includes(ele);
    });
}
var filteredSuspects = filterMe(suspects);
var filteredWeapons = filterMe(weapons);
var filteredRooms = filterMe(rooms);

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
    let selectedOptionsArr = [selectedSuspect,selectedWeapon,selectedRoom];

    if (selectedSuspect === murderSecret[0] &&
        selectedWeapon === murderSecret[1] &&
        selectedRoom === murderSecret[2]) {
        console.log("I won");
        document.getElementById('continue-placeholder').innerHTML = `
        <p>
        That was the correct guess! `+selectedSuspect+` did it with the `+ selectedWeapon+` in the `+selectedRoom+`!</br>
        Click to start a new game: 
        <input id="reset-button" type="button" value="New Game"/> 
        </p>
        `;
    }
    else{
        console.log("I did not win");
        let compHasCards = selectedOptionsArr.filter(function (ele) {
            return compCards.includes(ele);
        });
        let showCard = compHasCards[Math.floor(Math.random() * compHasCards.length)];
        console.log(showCard);
        document.getElementById('continue-placeholder').innerHTML = `
        <p>
        Sorry that was an incorrect guess! The Computer holds the card for `+showCard+`.<br/>
        Click to continue: 
        <input id="continue-button" type="button" value="Continue"/> 
        </p> `;
    }
});

//Continue button event
var continueButton = document.getElementById("continue-button");
continueButton.addEventListener('click',function(e){
    e.preventDefault();


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