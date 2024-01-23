module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING, // Assuming the sender's username is a string
      allowNull: false,
    },
  });

  return Message;
};
