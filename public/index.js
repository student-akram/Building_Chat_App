/* =========================
   AUTH CHECK
========================= */

const token = sessionStorage.getItem("token");
const myEmail = sessionStorage.getItem("email");
const myId = Number(sessionStorage.getItem("userId"));

if (!token) {
    window.location.href = "login.html";
}

console.log("Logged user:", myEmail);
console.log("User ID:", myId);


/* =========================
   CLEAR SEARCH INPUT
========================= */

window.addEventListener("load", () => {

    const input = document.getElementById("emailSearch");

    if (input) {
        input.value = "";
        input.placeholder = "Enter user email to chat";
    }

});


/* =========================
   SOCKET CONNECTION
========================= */

const socket = io({
    auth: {
        token: token
    }
});

let currentRoom = null;


/* =========================
   SOCKET CONNECT
========================= */

socket.on("connect", () => {

    console.log("Socket connected:", socket.id);

    /*
       Rejoin room after reconnect
    */

    if (currentRoom) {

        socket.emit("join_room", currentRoom);

        console.log(
            "Rejoining room:",
            currentRoom
        );

    }

});


/* =========================
   SOCKET ERROR
========================= */

socket.on("connect_error", (error) => {

    console.error(
        "Socket connection error:",
        error
    );

});


/* =========================
   PREVIOUS MESSAGES
========================= */

socket.on("previous_messages", (messages) => {

    const chatBox =
        document.getElementById("chatMessages");

    chatBox.innerHTML = "";

    messages.forEach((msg) => {

        const div =
            document.createElement("div");

        const sender =
            Number(msg.senderId);


        if (sender === myId) {

            div.className =
                "message sent";

        } else {

            div.className =
                "message received";

        }


        /*
           Display media or text
        */

        if (
            msg.message &&
            msg.message.startsWith("http")
        ) {

            displayMedia(
                div,
                msg.message
            );

        } else {

            div.textContent =
                msg.message;

        }


        chatBox.appendChild(div);

    });


    chatBox.scrollTop =
        chatBox.scrollHeight;

});


/* =========================
   RECEIVE PERSONAL MESSAGE
========================= */

socket.on("new_message", (data) => {

    const chatBox =
        document.getElementById("chatMessages");

    const div =
        document.createElement("div");

    const sender =
        Number(data.senderId);


    if (sender === myId) {

        div.className =
            "message sent";

    } else {

        div.className =
            "message received";

    }


    div.textContent =
        data.message;


    chatBox.appendChild(div);

    chatBox.scrollTop =
        chatBox.scrollHeight;


    /* =========================
       AI SMART REPLIES
    ========================= */

    fetch("/api/ai/reply", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: data.message
        })

    })

        .then((res) => res.json())

        .then((data) => {

            const replyBox =
                document.getElementById(
                    "suggestions"
                );


            if (!data.replies) {
                return;
            }


            replyBox.innerHTML = "";


            data.replies.forEach((reply) => {

                const btn =
                    document.createElement(
                        "button"
                    );


                btn.innerText =
                    reply;


                btn.onclick = () => {

                    document.getElementById(
                        "messageInput"
                    ).value = reply;

                };


                replyBox.appendChild(btn);

            });

        })

        .catch((err) => {

            console.error(
                "AI reply error:",
                err
            );

        });

});


/* =========================
   RECEIVE GROUP MESSAGE
========================= */

socket.on("group_message", (data) => {

    const chatBox =
        document.getElementById(
            "chatMessages"
        );

    const div =
        document.createElement("div");


    if (
        Number(data.senderId) === myId
    ) {

        div.classList.add(
            "message",
            "sent"
        );

    } else {

        div.classList.add(
            "message",
            "received"
        );

    }


    div.innerText =
        data.message;


    chatBox.appendChild(div);

    chatBox.scrollTop =
        chatBox.scrollHeight;

});


/* =========================
   RECEIVE MEDIA
========================= */

socket.on("media_message", (data) => {

    const chatBox =
        document.getElementById(
            "chatMessages"
        );

    const div =
        document.createElement("div");

    const sender =
        Number(data.senderId);


    if (sender === myId) {

        div.className =
            "message sent";

    } else {

        div.className =
            "message received";

    }


    displayMedia(
        div,
        data.url
    );


    chatBox.appendChild(div);

    chatBox.scrollTop =
        chatBox.scrollHeight;

});


/* =========================
   DISPLAY MEDIA
========================= */

function displayMedia(div, url) {

    if (!url) {
        return;
    }


    /*
       Check if the URL points to an image.
    */

    const isImage =
        /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i
            .test(url);


    if (isImage) {

        div.innerHTML = `
            <a
                href="${url}"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="${url}"
                    class="chat-image"
                    alt="Shared image"
                >
            </a>
        `;

    } else {

        /*
           PDF and other files
        */

        div.innerHTML = `
            <a
                href="${url}"
                target="_blank"
                rel="noopener noreferrer"
                class="file-link"
            >
                📎 Open shared file
            </a>
        `;

    }

}


/* =========================
   START PERSONAL CHAT
========================= */

async function joinRoom() {

    const input =
        document.getElementById(
            "emailSearch"
        );

    const email =
        input.value
            .trim()
            .toLowerCase();


    if (!email) {

        alert("Enter friend's email");

        return;

    }


    try {

        const res = await fetch(
            `/api/users/check-user/${encodeURIComponent(email)}`
        );


        const data =
            await res.json();


        if (!data.exists) {

            alert("User not found");

            return;

        }


        const friendId =
            Number(data.userId);


        console.log(
            "My ID:",
            myId
        );

        console.log(
            "Friend ID:",
            friendId
        );


        /* =========================
           PREVENT SELF CHAT
        ========================= */

        if (myId === friendId) {

            alert(
                "You cannot chat with yourself"
            );

            return;

        }


        /* =========================
           SAME ROOM FOR BOTH USERS
        ========================= */

        const roomId =
            myId < friendId
                ? `${myId}_${friendId}`
                : `${friendId}_${myId}`;


        currentRoom =
            roomId;


        console.log(
            "Joining room:",
            roomId
        );


        socket.emit(
            "join_room",
            roomId
        );


        /*
           Clear previous chat UI
        */

        document.getElementById(
            "chatMessages"
        ).innerHTML = "";


    } catch (err) {

        console.error(
            "Join room error:",
            err
        );

        alert(
            "Unable to start chat"
        );

    }

}


/* =========================
   SEND TEXT MESSAGE
========================= */

function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );

    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    if (!currentRoom) {

        alert(
            "Start a chat first"
        );

        return;

    }


    socket.emit(
        "new_message",
        {
            roomId: currentRoom,
            message: message
        }
    );


    input.value = "";

}


/* =========================
   CREATE GROUP
========================= */

function createGroup() {

    const input =
        document.getElementById(
            "groupName"
        );

    const groupName =
        input.value.trim();


    if (!groupName) {

        alert(
            "Enter group name"
        );

        return;

    }


    const room =
        `group_${groupName}`;


    socket.emit(
        "create_group",
        groupName
    );


    currentRoom =
        room;


    console.log(
        "Created group:",
        room
    );

}


/* =========================
   JOIN GROUP
========================= */

function joinGroup() {

    const input =
        document.getElementById(
            "groupName"
        );

    const groupName =
        input.value.trim();


    if (!groupName) {

        alert(
            "Enter group name"
        );

        return;

    }


    const room =
        `group_${groupName}`;


    socket.emit(
        "join_group",
        groupName
    );


    currentRoom =
        room;


    console.log(
        "Joined group:",
        room
    );

}


/* =========================
   SEND MEDIA
========================= */

async function sendMedia() {

    try {

        /* =========================
           CHECK ROOM
        ========================= */

        if (!currentRoom) {

            alert(
                "Start a chat first"
            );

            return;

        }


        /* =========================
           GET FILE
        ========================= */

        const fileInput =
            document.getElementById(
                "mediaInput"
            );

        const file =
            fileInput.files[0];


        if (!file) {

            alert(
                "Select a file"
            );

            return;

        }


        console.log(
            "Uploading:",
            file.name
        );


        /* =========================
           FORM DATA
        ========================= */

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );


        /* =========================
           UPLOAD TO S3
        ========================= */

        const res = await fetch(
            "/api/media/upload",
            {
                method: "POST",
                body: formData
            }
        );


        const data =
            await res.json();


        /* =========================
           CHECK UPLOAD RESPONSE
        ========================= */

        if (!res.ok) {

            console.error(
                "Upload failed:",
                data
            );


            alert(
                "File upload failed: " +
                (
                    data.details ||
                    data.error ||
                    "Unknown error"
                )
            );


            return;

        }


        /* =========================
           CHECK S3 URL
        ========================= */

        if (!data.url) {

            console.error(
                "No URL received:",
                data
            );


            alert(
                "Upload failed: S3 URL was not returned"
            );


            return;

        }


        console.log(
            "S3 URL:",
            data.url
        );


        /* =========================
           SEND URL THROUGH SOCKET
        ========================= */

        socket.emit(
            "media_message",
            {
                roomId: currentRoom,
                url: data.url
            }
        );


        /* =========================
           CLEAR FILE INPUT
        ========================= */

        fileInput.value = "";


    } catch (err) {

        console.error(
            "Media upload error:",
            err
        );


        alert(
            "File upload failed"
        );

    }

}


/* =========================
   LOGOUT
========================= */

function logout() {

    sessionStorage.removeItem(
        "token"
    );

    sessionStorage.removeItem(
        "email"
    );

    sessionStorage.removeItem(
        "userId"
    );


    window.location.href =
        "login.html";

}


/* =========================
   AI MESSAGE SUGGESTIONS
========================= */

const messageInput =
    document.getElementById(
        "messageInput"
    );

const suggestionBox =
    document.getElementById(
        "suggestions"
    );


if (messageInput) {

    messageInput.addEventListener(
        "input",
        async () => {

            const text =
                messageInput.value.trim();


            if (text.length < 3) {

                suggestionBox.innerHTML = "";

                return;

            }


            try {

                const res =
                    await fetch(
                        "/api/ai/suggest",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                text
                            })
                        }
                    );


                const data =
                    await res.json();


                if (!data.suggestions) {
                    return;
                }


                suggestionBox.innerHTML =
                    "";


                data.suggestions.forEach(
                    (suggestion) => {

                        const btn =
                            document.createElement(
                                "button"
                            );


                        btn.innerText =
                            suggestion;


                        btn.onclick = () => {

                            messageInput.value =
                                suggestion;

                            suggestionBox.innerHTML =
                                "";

                        };


                        suggestionBox.appendChild(
                            btn
                        );

                    }
                );


            } catch (err) {

                console.error(
                    "AI suggestion error:",
                    err
                );

            }

        }
    );

}