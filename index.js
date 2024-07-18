const inputslidebar = document.querySelector("#passrangebar");

const DisplayLen =  document.querySelector("#passwordlength");

const passwordDisplay = document.querySelector("#passwordinputfilled");

const copyAfterCopyClick = document.querySelector("#copyaftercopy");

const copyButton = document.querySelector("#copytag");

const UppercaseOption = document.querySelector("#Uppercase");
const LowerCaseOption = document.querySelector("#Lowercase");
const SpecialSymbol = document.querySelector("#specialsymbol");
const NumberOption = document.querySelector("#numbersopt");

const IndicatorofPass = document.querySelector(".colordiv");

const GenerateButton = document.querySelector("#generate_passwordbtn");

const AllCheckBox = document.querySelectorAll(".passopt input");

// default values 
IndicatorofPass.style.backgroundColor = "white";
IndicatorofPass.style.backgroundColor = "0 8px 22px 0 rgba(157, 166, 233, 0.742), 0 4px 6px 0 rgba(122, 134, 208, 0.427);";

UppercaseOption.checked = true;

var symbols = "!@#$%^&*()-_=+[]{}|;:',.<>?/";
let newpassword = "";
let startingPassLength = 8;
let tickedbox = 1;

SliderHandle();

// Function which handle length of password 

function SliderHandle(){
    inputslidebar.value = startingPassLength;
    DisplayLen.innerText = inputslidebar.value;
}

// function which set indicator color

function SetIndiacatorColor(color){
    IndicatorofPass.style.backgroundColor = color;
    // lets add glow
    IndicatorofPass.style.boxShadow = "0.1rem 0.1rem 1rem white";
    IndicatorofPass.style.perspective = "40px";

}

function RandomIntegerNumbers(min,max){
    return Math.floor(Math.random() * (max - min) + min);
}

// now using upper function we calculate diffrent random things

function RandomNumber(){
    return RandomIntegerNumbers(0,9);
}

function RandomLowerCase(){
    return String.fromCharCode(RandomIntegerNumbers(97,123));
}

function RandomUpperCase(){
    return String.fromCharCode(RandomIntegerNumbers(65,91));
}

function RandomSymbol(){
    let num = RandomIntegerNumbers(0,symbols.length);
    return symbols[num];
}

// function for strength

function Strength(){
    let Upper = false;
    let Lower = false;
    let Sym = false;
    let Numb = false;
    if(UppercaseOption.checked) Upper = true;
    if(LowerCaseOption.checked) Lower = true;
    if(SpecialSymbol.checked)  Sym = true;
    if(NumberOption.checked)  Numb = true;

    if((Upper && Lower && Sym && Numb && startingPassLength>=8) || startingPassLength>=12){
        SetIndiacatorColor("green");
    }
    else if((Upper && (Lower || Sym || Numb)) || (Lower && (Upper || Sym || Numb)) 
        || (Sym && (Upper || Lower || Numb)) || (Numb &&(Lower || Upper || Sym)) 
    || (Upper && Lower && Numb) || (Upper && Lower && Sym) || (Lower && Sym && Numb) 
 || (Upper && Numb && Sym)) {
        SetIndiacatorColor("yellow");
    }
    else {
        SetIndiacatorColor("red");
    }
}

// function for copy the password from input

async function CopyPassword(){
    if(copyAfterCopyClick.value !=""){
    try{
     await (navigator.clipboard.writeText(passwordDisplay.value));
     copyAfterCopyClick.innerText("copied");
    }
    catch(e){
        copyAfterCopyClick.innerText("failed!");
    }
    // to visible copied message
    copyAfterCopyClick.classList.add("active");

    // to remove copied message after  2s 

    setTimeout(() => {
        copyAfterCopyClick.classList.remove("active");
    }, 2000); }
    else{
    alert("You don't generate any password");
    }
}

// copybutton Event Listener
copyButton.addEventListener('click', CopyPassword);

// making value of password length same as  slide bar slides to new values

inputslidebar.addEventListener('input', (e) =>{
    startingPassLength = e.target.value;
    SliderHandle();

});

// how many check box tick or untick
function handleCheckBox(){
    tickedbox = 0;
    AllCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked) tickedbox++;
    });
    if(tickedbox>startingPassLength){
        startingPassLength = tickedbox;
    SliderHandle();
    }
    return tickedbox;
}

AllCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBox)
});

// Generate Password listner

GenerateButton.addEventListener('click',() => {
    if(tickedbox<=0) return; // if no checkbox is clicked then no password generate
    if(tickedbox> startingPassLength){ 
        startingPassLength  = tickedbox;
        SliderHandle();
    }
    // lets generate new password

    newpassword = "";
    arrfun = [];
    if(UppercaseOption.checked){
        arrfun.push(RandomUpperCase);
    }
    if(LowerCaseOption.checked) {
        arrfun.push(RandomLowerCase);
    }
    if(NumberOption.checked) {
        arrfun.push(RandomNumber);
    }
    if(SpecialSymbol.checked){
        arrfun.push(RandomSymbol);
    }
    // all checkboxes symbols first added to newpassword
    for(let i=0;i<arrfun.length;i++){
        newpassword += arrfun[i]();
    }
    // now remaining symbols
    let remainingLen = startingPassLength - arrfun.length;
    for(let i = 1; i<=remainingLen;i++){
        num = RandomIntegerNumbers(0,arrfun.length);
        newpassword += arrfun[num]();
    }
    newpassword = Sufflepass();
    passwordDisplay.value = newpassword;
    Strength();

});

function Sufflepass(){
    const arr = newpassword.split(''); // Convert string to an array
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join(''); 
}
