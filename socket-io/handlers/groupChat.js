module.exports = (io, socket) => {

// Create group
socket.on("create_group", (groupName) => {

const room = `group_${groupName}`;

socket.join(room);

console.log(`User ${socket.user.id} created group ${room}`);

});

// Join group
socket.on("join_group", (groupName) => {

const room = `group_${groupName}`;

socket.join(room);

console.log(`User ${socket.user.id} joined group ${room}`);

});

// Send group message
socket.on("group_message", (data) => {

const { groupName, message } = data;

const room = `group_${groupName}`;

io.to(room).emit("group_message", {
message,
senderId: socket.user.id
});

});

// Send media message
socket.on("media_message", (data) => {

const { roomId, url } = data;

io.to(roomId).emit("media_message", {
url,
senderId: socket.user.id
});

});

};