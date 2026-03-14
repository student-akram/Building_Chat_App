const cron = require("node-cron");
const { Op } = require("sequelize");

const Message = require("../models/message");
const ArchivedMessage = require("../models/archivedMessage");

cron.schedule("0 0 * * *", async () => {

console.log("Running archive job...");

try{

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const oldMessages = await Message.findAll({
where:{
createdAt:{
[Op.lt]: yesterday
}
}
});

if(oldMessages.length === 0){
console.log("No messages to archive");
return;
}

/* move to archive table */

await ArchivedMessage.bulkCreate(
oldMessages.map(msg => ({
message: msg.message,
roomId: msg.roomId,
senderId: msg.senderId,
createdAt: msg.createdAt,
updatedAt: msg.updatedAt
}))
);

/* delete from main table */

await Message.destroy({
where:{
createdAt:{
[Op.lt]: yesterday
}
}
});

console.log("Archived old messages successfully");

}catch(err){
console.error("Archive job error:", err);
}

});