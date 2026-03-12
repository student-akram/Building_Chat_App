const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {

id:{
type:DataTypes.INTEGER,
autoIncrement:true,
primaryKey:true
},

message:{
type:DataTypes.TEXT,
allowNull:false
},

roomId:{
type:DataTypes.STRING,
allowNull:false
},

senderId:{
type:DataTypes.INTEGER,
allowNull:false
}

});

module.exports = Message;