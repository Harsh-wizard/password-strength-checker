const password = document.getElementById("password");

const strengthBar = document.getElementById("strength-bar");

const strengthText = document.getElementById("strength-text");

const breachResult = document.getElementById("breach-result");

const suggestions = document.getElementById("suggestions");

const toggleBtn = document.getElementById("toggleBtn");

const generateBtn = document.getElementById("generateBtn");

const checkBtn = document.getElementById("checkBtn");

password.addEventListener("input", checkStrength);

toggleBtn.addEventListener("click", togglePassword);

generateBtn.addEventListener("click", generatePassword);

checkBtn.addEventListener("click", checkBreach);



function checkStrength(){

    const pass = password.value;

    let score = 0;

    suggestions.innerHTML = "";

    // LENGTH

    if(pass.length >= 8){
        score++;
    }
    else{
        suggestions.innerHTML +=
        "• Add at least 8 characters<br>";
    }

    // UPPERCASE

    if(/[A-Z]/.test(pass)){
        score++;
    }
    else{
        suggestions.innerHTML +=
        "• Add uppercase letter<br>";
    }

    // LOWERCASE

    if(/[a-z]/.test(pass)){
        score++;
    }
    else{
        suggestions.innerHTML +=
        "• Add lowercase letter<br>";
    }

    // NUMBER

    if(/[0-9]/.test(pass)){
        score++;
    }
    else{
        suggestions.innerHTML +=
        "• Add number<br>";
    }

    // SPECIAL CHARACTER

    if(/[!@#$%^&*]/.test(pass)){
        score++;
    }
    else{
        suggestions.innerHTML +=
        "• Add special character<br>";
    }

    // STRENGTH DISPLAY

    if(score <= 2){

        strengthText.innerHTML =
        "Weak Password";

        strengthBar.style.width = "33%";

        strengthBar.style.background = "red";

        password.style.borderColor = "red";
    }

    else if(score <= 4){

        strengthText.innerHTML =
        "Medium Password";

        strengthBar.style.width = "66%";

        strengthBar.style.background = "orange";

        password.style.borderColor = "orange";
    }

    else{

        strengthText.innerHTML =
        "Strong Password";

        strengthBar.style.width = "100%";

        strengthBar.style.background = "green";

        password.style.borderColor = "green";
    }
}



// SHOW/HIDE PASSWORD

function togglePassword(){

    if(password.type === "password"){

        password.type = "text";

        toggleBtn.innerHTML = "Hide";
    }

    else{

        password.type = "password";

        toggleBtn.innerHTML = "Show";
    }
}



// PASSWORD GENERATOR

function generatePassword(){

    const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    let generated = "";

    for(let i = 0; i < 14; i++){

        generated += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    password.value = generated;

    checkStrength();
}



// SHA-1 HASH FUNCTION

async function sha1(message){

    const msgBuffer =
    new TextEncoder().encode(message);

    const hashBuffer =
    await crypto.subtle.digest("SHA-1", msgBuffer);

    const hashArray =
    Array.from(new Uint8Array(hashBuffer));

    const hashHex =
    hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

    return hashHex.toUpperCase();
}



// BREACH CHECK

async function checkBreach(){

    const pass = password.value;

    if(pass.length === 0){

        breachResult.innerHTML =
        "Enter password first";

        breachResult.style.color = "red";

        return;
    }

    breachResult.innerHTML =
    "Checking breaches...";

    // CREATE SHA1 HASH

    const hash = await sha1(pass);

    const prefix = hash.substring(0,5);

    const suffix = hash.substring(5);

    // API REQUEST

    const response = await fetch(

        `https://api.pwnedpasswords.com/range/${prefix}`

    );

    const data = await response.text();

    const lines = data.split("\n");

    let found = false;

    for(let line of lines){

        const parts = line.split(":");

        const hashSuffix = parts[0].trim();

        const count = parts[1].trim();

        if(hashSuffix === suffix){

            found = true;

            breachResult.innerHTML =

            `⚠ Password found in data breaches ${count} times`;

            breachResult.style.color = "red";

            break;
        }
    }

    if(!found){

        breachResult.innerHTML =

        "✅ Password not found in known breaches";

        breachResult.style.color = "green";
    }
}