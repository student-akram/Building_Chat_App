const socket = io("http://localhost:5000",{
auth:{
token: localStorage.getItem("token")
},
transports:["websocket"]
});
socket.on("newMessage",(msg)=>{

const chatBox = document.getElementById("chatMessages");

const messageDiv = document.createElement("div");
messageDiv.classList.add("message");

if(msg.userId == localStorage.getItem("userId")){
messageDiv.classList.add("sent");
}else{
messageDiv.classList.add("received");
}

const time = new Date(msg.createdAt).toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
});

messageDiv.innerHTML = `
${msg.message}
<span class="timestamp">${time}</span>
`;

chatBox.appendChild(messageDiv);
chatBox.scrollTop = chatBox.scrollHeight;

});


async function sendMessage(){

const input = document.getElementById("messageInput");
const messageText = input.value.trim();

if(messageText === "") return;

try{

const token = localStorage.getItem("token");

await fetch("http://localhost:5000/api/chat/send",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":token
},

body:JSON.stringify({
message:messageText
})

});

}catch(err){
console.log(err);
}

input.value="";

}


async function loadMessages(){

const chatBox=document.getElementById("chatMessages");

try{

const response = await fetch("http://localhost:5000/api/chat/messages");

const messages = await response.json();

chatBox.innerHTML="";

messages.forEach(msg=>{

const messageDiv=document.createElement("div");

messageDiv.classList.add("message");

if(msg.userId == localStorage.getItem("userId")){
messageDiv.classList.add("sent");
}else{
messageDiv.classList.add("received");
}

const time = new Date(msg.createdAt).toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
});

messageDiv.innerHTML=`
${msg.message}
<span class="timestamp">${time}</span>
`;

chatBox.appendChild(messageDiv);

});

chatBox.scrollTop = chatBox.scrollHeight;

}catch(err){
console.log(err);
}

}

window.onload = loadMessages;


function logout(){

localStorage.removeItem("token");
localStorage.removeItem("userId");

window.location.href="login.html";

}