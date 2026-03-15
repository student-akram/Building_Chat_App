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

const sender = Number(msg.senderId);

if(sender === myId){
div.className = "message sent";
}else{
div.className = "message received";
}

if(msg.message.startsWith("http")){
div.innerHTML = `
<a href="${msg.message}" target="_blank">
<img src="${msg.message}" class="chat-image">
</a>
`;
}else{
div.textContent = msg.message;
}

chatBox.appendChild(div);

});

chatBox.scrollTop = chatBox.scrollHeight;

});
/* scroll bottom */





/* RECEIVE PERSONAL MESSAGE */

socket.on("new_message",(data)=>{

const chatBox = document.getElementById("chatMessages");
const div = document.createElement("div");

const sender = Number(data.senderId);

if(sender === myId){
div.className = "message sent";
}else{
div.className = "message received";
}

div.textContent = data.message;

chatBox.appendChild(div);
chatBox.scrollTop = chatBox.scrollHeight;
fetch("/api/ai/reply",{
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({message:data.message})
})
.then(res=>res.json())
.then(data=>{

const replyBox = document.getElementById("suggestions");

replyBox.innerHTML="";

data.replies.forEach(r=>{

const btn = document.createElement("button");

btn.innerText = r;

btn.onclick = ()=>{
document.getElementById("messageInput").value = r;
};

replyBox.appendChild(btn);

});

});

});

/* RECEIVE GROUP MESSAGE */

socket.on("group_message",(data)=>{

const chatBox = document.getElementById("chatMessages");

const div = document.createElement("div");
div.classList.add("message");

if(data.senderId === Number(localStorage.getItem("userId"))){
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

const sender = Number(data.senderId);

if(sender === myId){
div.className = "message sent";
}else{
div.className = "message received";
}

div.innerHTML = `
<a href="${data.url}" target="_blank">
<img src="${data.url}" class="chat-image">
</a>
`;

chatBox.appendChild(div);
chatBox.scrollTop = chatBox.scrollHeight;

});
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

const myId = Number(localStorage.getItem("userId"));
const friendId = Number(data.userId);
console.log("My ID:", myId, "Friend ID:", friendId);

/* FINAL SELF CHAT CHECK */

if(String(myId) === String(friendId)){
    alert("You cannot chat with yourself");
    return;
}

/* SAME ROOM FOR BOTH USERS */

const roomId = myId < friendId
? `${myId}_${friendId}`
: `${friendId}_${myId}`;

currentRoom = roomId;

console.log("My ID:", myId);
console.log("Friend ID:", friendId);
console.log("Joining room:", roomId);

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
url:data.url,
senderId: Number(localStorage.getItem("userId"))
});

}

/* LOGOUT */

function logout(){

localStorage.removeItem("token");
localStorage.removeItem("email");
localStorage.removeItem("userId");

window.location.href = "login.html";

}
const input = document.getElementById("messageInput");
const suggestionBox = document.getElementById("suggestions");

input.addEventListener("input", async ()=>{

const text = input.value;

if(text.length < 3) return;

const res = await fetch("/api/ai/suggest",{
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({text})
});

const data = await res.json();

suggestionBox.innerHTML="";

data.suggestions.forEach(s=>{

const btn = document.createElement("button");

btn.innerText = s;

btn.onclick = ()=>{
input.value = s;
};

suggestionBox.appendChild(btn);

});

});