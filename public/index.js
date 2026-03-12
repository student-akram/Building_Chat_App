window.addEventListener("load", () => {

const input = document.getElementById("emailSearch");

if(input){
input.value = "";
input.placeholder = "Enter user email to chat";
}

});
if(!localStorage.getItem("token")){
    window.location.href = "login.html";
}

const myEmail = localStorage.getItem("email");
const myId = Number(localStorage.getItem("userId"));

console.log("Logged user:", myEmail);
console.log("User ID:", myId);


const socket = io("http://localhost:5000", {
auth:{
token: localStorage.getItem("token")
}
});

let currentRoom = null;

socket.on("connect", () => {

console.log("Connected:", socket.id);

/* rejoin room after reconnect */

if(currentRoom){
socket.emit("join_room", currentRoom);
console.log("Rejoining room:", currentRoom);
}

});
/* OLD MESSAGES */

socket.on("previous_messages",(messages)=>{

const chatBox = document.getElementById("chatMessages");

chatBox.innerHTML="";

messages.forEach(msg=>{

const div = document.createElement("div");
div.classList.add("message");

if(msg.userId == localStorage.getItem("userId")){
div.classList.add("sent");
}else{
div.classList.add("received");
}

div.innerText = msg.message;

chatBox.appendChild(div);

});

});

/* RECEIVE PERSONAL MESSAGE */

socket.on("new_message",(data)=>{

const chatBox = document.getElementById("chatMessages");

const div = document.createElement("div");
div.classList.add("message");

if(data.senderId == localStorage.getItem("userId")){
div.classList.add("sent");
}else{
div.classList.add("received");
}

div.innerText = data.message;

chatBox.appendChild(div);
chatBox.scrollTop = chatBox.scrollHeight;

});

/* RECEIVE GROUP MESSAGE */

socket.on("group_message",(data)=>{

const chatBox = document.getElementById("chatMessages");

const div = document.createElement("div");
div.classList.add("message");

if(data.senderId == localStorage.getItem("userId")){
div.classList.add("sent");
}else{
div.classList.add("received");
}

div.innerText = data.message;

chatBox.appendChild(div);

});

/* RECEIVE MEDIA */

socket.on("media_message",(data)=>{

const chatBox = document.getElementById("chatMessages");

const div = document.createElement("div");
div.classList.add("message");

div.innerHTML = `
<a href="${data.url}" target="_blank">
<img src="${data.url}" width="200"/>
</a>
`;

chatBox.appendChild(div);

});

/* START PERSONAL CHAT */

/* START PERSONAL CHAT */

async function joinRoom(){

const email = document.getElementById("emailSearch").value.trim().toLowerCase();

if(!email){
alert("Enter email");
return;
}

try{

const res = await fetch(`http://localhost:5000/api/users/check-user/${email}`);
const data = await res.json();

if(!data.exists){
alert("User not found");
return;
}

/* convert IDs to numbers */

const myId = Number(localStorage.getItem("userId"));
const friendId = Number(data.userId);

/* prevent self chat */

if(myId === friendId){
alert("You cannot chat with yourself");
return;
}

/* always create SAME room for both users */

const roomId = myId < friendId
? `${myId}_${friendId}`
: `${friendId}_${myId}`;

currentRoom = roomId;

console.log("My ID:", myId);
console.log("Friend ID:", friendId);
console.log("Joining room:", roomId);

/* JOIN ROOM */

socket.emit("join_room", roomId);

}catch(err){
console.log(err);
}

}
/* SEND MESSAGE */

function sendMessage(){

const input = document.getElementById("messageInput");
const message = input.value.trim();

if(message === "") return;

if(!currentRoom){
alert("Start chat first");
return;
}

/* send to server */

socket.emit("new_message",{
roomId: currentRoom,
message: message
});

input.value="";

}

/* CREATE GROUP */

function createGroup(){

const groupName = document.getElementById("groupName").value.trim();

socket.emit("create_group",groupName);

currentRoom = "group_"+groupName;

}

/* JOIN GROUP */

function joinGroup(){

const groupName = document.getElementById("groupName").value.trim();

socket.emit("join_group",groupName);

currentRoom = "group_"+groupName;

}

/* SEND MEDIA */

async function sendMedia(){

const file = document.getElementById("mediaInput").files[0];

if(!file){
alert("Select file");
return;
}

const formData = new FormData();

formData.append("file",file);

const res = await fetch("http://localhost:5000/api/media/upload",{
method:"POST",
body:formData
});

const data = await res.json();

socket.emit("media_message",{
roomId: currentRoom,
url:data.url
});

}

function logout(){

localStorage.removeItem("token");
localStorage.removeItem("email");
localStorage.removeItem("userId");

window.location.href = "login.html";

}