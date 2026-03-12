/* =========================
   SIGNUP
========================= */

const signupForm = document.querySelector("#signupForm");

if (signupForm) {

signupForm.addEventListener("submit", async (e)=>{

e.preventDefault();

const name = document.querySelector("#name").value.trim();
const email = document.querySelector("#email").value.trim();
const phone = document.querySelector("#phone").value.trim();
const password = document.querySelector("#password").value.trim();

try{

const response = await fetch("http://localhost:5000/api/auth/signup",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,email,phone,password
})
});

const data = await response.json();

alert(data.message);

if(data.message === "Signup successful"){
window.location.href="login.html";
}

}catch(err){
console.log(err);
}

});

}


/* =========================
   LOGIN
========================= */

const loginForm = document.querySelector("#loginForm");

if(loginForm){

loginForm.addEventListener("submit", async (e)=>{

e.preventDefault();

const loginInput = document.getElementById("loginInput").value.trim();
const password = document.getElementById("loginPassword").value.trim();

try{

const res = await fetch("http://localhost:5000/api/auth/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
loginInput,
password
})
});

const data = await res.json();

if(data.token){

/* CLEAR OLD STORAGE */

localStorage.clear();

/* SAVE NEW LOGIN DATA */

localStorage.setItem("token", data.token);
localStorage.setItem("userId", data.userId);
localStorage.setItem("email", data.email);

console.log("Logged userId:", data.userId);
console.log("Logged email:", data.email);

alert("Login Successful");

window.location.href="index.html";

}else{
alert(data.message);
}

}catch(err){
console.log(err);
}

});

}