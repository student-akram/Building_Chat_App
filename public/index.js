async function sendMessage(){

const input = document.getElementById("messageInput");
const messageText = input.value.trim();

if(messageText === "") return;

const chatBox = document.getElementById("chatMessages");

const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

try{

const token = localStorage.getItem("token");

await fetch("http://localhost:5000/api/chat/send", {

method: "POST",

headers: {
"Content-Type": "application/json",
"Authorization": token
},

body: JSON.stringify({
message: messageText
})

});

}catch(error){
console.log("Error sending message:", error);
}

const message = document.createElement("div");
message.classList.add("message","sent");

message.innerHTML = `
${messageText}
<span class="timestamp">${time}</span>
`;

chatBox.appendChild(message);

chatBox.scrollTop = chatBox.scrollHeight;

input.value = "";

}