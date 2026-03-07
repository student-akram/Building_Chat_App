

function sendMessage(){

const input=document.getElementById("messageInput");
const messageText=input.value.trim();

if(messageText==="") return;

const chatBox=document.getElementById("chatMessages");

const message=document.createElement("div");
message.classList.add("message","sent");

const time=new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

message.innerHTML=`
${messageText}
<span class="timestamp">${time}</span>
`;

chatBox.appendChild(message);

/* Auto Scroll */

chatBox.scrollTop=chatBox.scrollHeight;

input.value="";
}

