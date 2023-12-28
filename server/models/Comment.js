module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User);
    Comment.belongsTo(models.Topic);
  };

  return Comment;
};