//fetch all elements which are required
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");

const passwordLengthDisplay = document.querySelector("[data-passLength]");

const slider = document.querySelector("[data-lengthSlider]");

const uppercaseCheck = document.querySelector("#upperCase");
const lowercaseCheck = document.querySelector("#lowerCase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");

const generateBtn = document.querySelector(".generateBtn");

// symbol string ==> which is used to generate random symbol
const symbolString = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initilize
let password = "";
let passLength = 10;
let checkCnt = 1;

//set circle color to gray
setIndicator('#ccc');

sliderHandler();

// handle slider --> update password length
function sliderHandler() {
    slider.value = passLength;
    passwordLengthDisplay.innerText = passLength;

    //aur kuch? --> slider ball ke aage meko transperent karna hai
    let min = slider.min;
    let max = slider.max;
    let curr = slider.value;

    let percentage = ((curr - min) * 100) / (max - min);
    slider.style.background = `linear-gradient(to right, hsl(285, 91%, 52%) ${percentage}%, hsl(268, 47%, 21%) ${percentage}%)`;
    // upto percentage --> linear gradient and after percentage-->transperant
}

// listerner on slider
slider.addEventListener("input", function (event) {
    passLength = event.target.value;
    sliderHandler();
});

// generate random integer
function generateRandomInteger(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// generate random number
function generateRandomNumber() {
    return generateRandomInteger(0, 9);
}

// generate random uppercase
function generateRandomUpperCase() {
    let x = String.fromCharCode(generateRandomInteger(65, 90));
    return x;
}

// generate random lowercase
function generateRandomLowerCase() {
    let x = String.fromCharCode(generateRandomInteger(97, 123));
    return x;
}

// generate random symbol
function generateRandomSymbol() {
    let n = symbolString.length;
    let index = generateRandomInteger(0, n - 1);
    return symbolString[index];
}

// set indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// check password strength and set indictor color accordingly
function checkPasswordStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) {
        hasUpper = true;
    }

    if (lowercaseCheck.checked) {
        hasLower = true;
    }

    if (numberCheck.checked) {
        hasNumber = true;
    }

    if (symbolCheck.checked) {
        hasSymbol = true;
    }

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

//check box change handler
function handleCheckBoxChange() {
    checkCnt = 0;

    // again check for each checkbox and re-calculate checkCnt
    allCheckBoxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            checkCnt++;
        }
    })

    // special case
    if (checkCnt > passLength) {
        passLength = checkCnt;
        sliderHandler();
    }
}

// event listener on checkboxes --> to keep track of checkCnt because if checkCnt=0 then no password generate. So we need to keep track of checkcnt
allCheckBoxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        // console.log(checkbox.id, checkbox.checked); // for testing
        handleCheckBoxChange();
    })
})

// shuffle password
function shufflePassword(passArray) {
    // traverse complete Array
    for (let i = 0; i < passArray.length; i++) {
        // find random index
        let index = generateRandomInteger(i, passLength - 1);

        // swap i and index
        let temp = passArray[i];
        passArray[i] = passArray[index];
        passArray[index] = temp;
    }

    let ans = "";
    for (let i = 0; i < passArray.length; i++) {
        ans += passArray[i];
    }

    return ans;
}

// generate password
function generatePassword() {
    // none of the checkbox is selected
    if (checkCnt == 0) {
        return;
    }

    // special case
    if (passLength < checkCnt) {
        passLength = checkCnt;
        sliderHandler();
    }

    // let's go for to find new password
    console.log("Starting Journey");

    // step 1: remove old password
    password = "";

    // step2: let's put stuffs mentioned by checkboxes
    let checkTrackArr = [];

    if (uppercaseCheck.checked) {
        checkTrackArr.push(generateRandomUpperCase);
    }

    if (lowercaseCheck.checked) {
        checkTrackArr.push(generateRandomLowerCase);
    }

    if (numberCheck.checked) {
        checkTrackArr.push(generateRandomNumber);
    }

    if (symbolCheck.checked) {
        checkTrackArr.push(generateRandomSymbol);
    }

    // step 3: compulsoury addition
    for (let i = 0; i < checkTrackArr.length; i++) {
        password += checkTrackArr[i]();
    }
    console.log("Compulsory addition done");

    // step 4: random addition
    for (let i = password.length; i < passLength; i++) {
        let index = generateRandomInteger(0, checkTrackArr.length - 1);
        password += checkTrackArr[index]();
    }
    console.log("Remaining addition done");

    // step 5: password to checkbox ko dekhke guess kar sakte easily, so usko shuffle karna pdega
    let passArray = [];
    for (let i = 0; i < password.length; i++) {
        passArray.push(password[i]);
    }

    password = shufflePassword(passArray);
    console.log("Shuffling done");

    // step 6: Display password on screen
    passwordDisplay.value = password;
    console.log("Password display done");

    // step 7: check strength of password
    checkPasswordStrength();
    console.log("Check strength done");
}

// copy content
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (error) {
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add('active');
    setTimeout(function () {
        copyMsg.classList.remove('active');
    }, 2000)
}

// listener on copy button
copyBtn.addEventListener('click', function () {
    if (password.length > 0) {
        copyContent();
    }
});

// listener on generate button
generateBtn.addEventListener('click', function () {
    generatePassword();
})