const pass = document.querySelector("#password");
const sncp = document.querySelector("[data-cpymsg]");
const copysec = document.querySelector("#icon");
const slidvalue = document.querySelector(".lengthValue");
const genratebtn = document.querySelector("#generate");
const scolor = document.querySelector("[data-indicator]");
const sldr = document.querySelector("#passwordLengthSlider");
const upp = document.querySelector("#upparcase");
const low = document.querySelector("#lowercase");
const num = document.querySelector("#number");
const sym = document.querySelector("#symbol");
const allbox = document.querySelectorAll("input[type=checkbox]");
const symb = "!@~#%^&*";

// By default 
let password = "";
let value = 10;
let color = "gray"; // Set default color to gray
let count = 1;

// Calling
slidHandler();

// Functions
function slidHandler() {
    sldr.value = value;
    slidvalue.innerText = value;

    // Calculate the filled percentage
    const min = sldr.min; // Get the minimum value of the slider
    const max = sldr.max; // Get the maximum value of the slider
    const percentage = ((value - min) * 100) / (max - min); // Calculate the percentage filled

    // Set the background size based on the percentage
    sldr.style.backgroundSize = `${percentage}% 100%`;
}

function setIndicator() {
    scolor.style.backgroundColor = color; 
    scolor.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.5)";
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getUpper() {
    return String.fromCharCode(getRandomInteger(65, 91)); // 65 to 90 for A-Z
}

function getLower() {
    return String.fromCharCode(getRandomInteger(97, 123)); // 97 to 122 for a-z
}

function getNum() {
    return getRandomInteger(0, 10); // 0 to 9
}

function getSym() {
    const randNum = getRandomInteger(0, symb.length);
    return symb.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (upp.checked) hasUpper = true;
    if (low.checked) hasLower = true;
    if (num.checked) hasNum = true;
    if (sym.checked) hasSym = true;

    // Default color
    color = "gray"; // Set default color to gray

    if (hasUpper && hasLower && (hasNum || hasSym) && sldr.value >= 8) {
        color = "#0f0"; // Green
    } else if ((hasUpper || hasLower) && (hasNum || hasSym) && sldr.value <=5) {
        color = "#ff0"; // Yellow
    } else if (hasUpper || hasLower || hasNum || hasSym) {
        color = "#f00"; // Red
    }

    setIndicator(); // Update the indicator color
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(pass.value);
        sncp.innerText = "Copied!";
    } catch (e) {
        sncp.innerText = "Failed";
    }
    // To make copy message visible
    sncp.classList.add("active");

    // Invisible
    setTimeout(() => {
        sncp.classList.remove("active");
    }, 2000);
}

// Event listeners
sldr.addEventListener('input', (e) => {
    value = e.target.value;
    slidHandler();
    calcStrength(); // Update strength when slider changes
});

copysec.addEventListener('click', () => {
    if (pass.value) {
        copyContent();
    }
});

// Add event listeners for checkboxes
allbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleBox); // Call handleBox on checkbox change
});

function handleBox() {
    count = 0;
    allbox.forEach((checkbox) => {
        if (checkbox.checked) count++;
    });

    if (value <= count) {
        value = count;
        slidHandler();
    }
}

genratebtn.addEventListener('click', () => { 
    if (count <= 0) {
        return;
    }
    if (value <= count) {
        value = count;
        slidHandler();
    }

    password = "";

    // Generate password based on selected options
    for (let i = 0; i < value; i++) {
        if (upp.checked && password.length < value) {
            password += getUpper();
        }
        if (low.checked && password.length < value) {
            password += getLower();
        }
        if (num.checked && password.length < value) {
            password += getNum();
        }
        if (sym.checked && password.length < value) {
            password += getSym();
        }
    }

    // Shuffle the password to make it more random
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    pass.value = password;
    // call for change the indicator color
    calcStrength();
});