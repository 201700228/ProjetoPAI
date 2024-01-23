module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER, // Assuming user IDs are integers
      allowNull: false,
    },
  });
  return Message;
};
