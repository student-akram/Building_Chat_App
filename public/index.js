const socket = io("http://localhost:5000",{
auth:{
token: localStorage.getItem("token")
}
});

socket.on("connect",()=>{

const userId = localStorage.getItem("userId");

console.log("Joining room:", userId);

socket.emit("join_room", userId);

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


function sendMessage(){

const input = document.getElementById("messageInput");
const messageText = input.value.trim();

if(messageText === "") return;

if(!currentRoom){
alert("Please join a chat room first");
return;
}

socket.emit("new_message",{
roomId: currentRoom,
message: messageText
});

input.value = "";

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
function sendPersonalMessage(receiverId,message){

socket.emit("new_message",{
receiverId,
message
});

}

function joinRoom(){

const email = document.getElementById("emailSearch").value;

const myEmail = localStorage.getItem("email");

const roomId = [myEmail, email].sort().join("_");

currentRoom = roomId;

socket.emit("join_room", roomId);

console.log("Joined room:", roomId);

}
socket.on("new_message",(data)=>{

const chatBox = document.getElementById("chatMessages");

const div = document.createElement("div");

div.innerText = data.message;

chatBox.appendChild(div);

});


