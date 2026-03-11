const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token")
  }
});

let currentRoom = null;

/* ===============================
   SOCKET CONNECTION
================================ */

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

/* ===============================
   RECEIVE PERSONAL MESSAGE
================================ */

socket.on("new_message", (data) => {

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

/* ===============================
   RECEIVE GROUP MESSAGE
================================ */

socket.on("group_message", (data) => {

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

/* ===============================
   RECEIVE MEDIA MESSAGE
================================ */

socket.on("media_message",(data)=>{

const chatBox = document.getElementById("chatMessages");

const div = document.createElement("div");
div.classList.add("message");

if(data.senderId == localStorage.getItem("userId")){
  div.classList.add("sent");
}else{
  div.classList.add("received");
}

div.innerHTML = `
<a href="${data.url}" target="_blank">
<img src="${data.url}" width="200"/>
</a>
`;

chatBox.appendChild(div);

});

/* ===============================
   SEND GROUP MESSAGE
================================ */

function sendMessage(){

  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if(message === "") return;

  socket.emit("group_message", {
    groupName: currentRoom.replace("group_", ""),
    message: message
  });
  socket.emit("sendMessage", {
roomId: currentRoom,
message: message
});

  input.value = "";

}


/* ===============================
   SEND PERSONAL MESSAGE
================================ */

function sendPersonalMessage(message){

  if(!currentRoom) return;

  socket.emit("new_message",{
    roomId: currentRoom,
    message: message
  });

}


/* ===============================
   JOIN PERSONAL CHAT ROOM
================================ */

async function joinRoom(){

  const email = document.getElementById("emailSearch").value.trim();

  if(!email){
    alert("Enter email");
    return;
  }

  const myEmail = localStorage.getItem("email");

  try{

    const res = await fetch(`http://localhost:5000/api/users/check-user/${email}`);
    const data = await res.json();
    
    if(!data.exists){
      alert("User not found");
      return;
    }

    const roomId = [myEmail, email].sort().join("_");

    currentRoom = roomId;

    socket.emit("join_room", roomId);

    console.log("Joined personal room:", roomId);

  }catch(err){
    console.log(err);
  }

}


/* ===============================
   CREATE GROUP
================================ */

function createGroup(){

  const groupName = document.getElementById("groupName").value;

  socket.emit("create_group", groupName);

  currentRoom = "group_" + groupName;

  console.log("Group created:", currentRoom);

}


/* ===============================
   JOIN GROUP
================================ */

function joinGroup(){

  const groupName = document.getElementById("groupName").value;

  socket.emit("join_group", groupName);

  currentRoom = "group_" + groupName;

  console.log("Joined group:", currentRoom);

}


/* ===============================
   SEND MEDIA
================================ */

async function sendMedia(){

  const file = document.getElementById("mediaInput").files[0];

  if(!file) return;

  const formData = new FormData();
  formData.append("media", file);

  const res = await fetch("http://localhost:5000/api/media/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  socket.emit("media_message", {
    roomId: currentRoom,
    url: data.url
  });

}


/* ===============================
   LOAD OLD MESSAGES
================================ */

async function loadMessages(){

  const chatBox = document.getElementById("chatMessages");

  try{

    const response = await fetch("http://localhost:5000/api/chat/messages");
    const messages = await response.json();

    chatBox.innerHTML = "";

    messages.forEach(msg => {

      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");

      if(msg.userId == localStorage.getItem("userId")){
        messageDiv.classList.add("sent");
      }else{
        messageDiv.classList.add("received");
      }

      const time = new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      messageDiv.innerHTML = `
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


/* ===============================
   LOGOUT
================================ */

function logout(){

  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  window.location.href = "login.html";

}