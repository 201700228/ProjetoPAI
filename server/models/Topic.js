module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
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

  Topic.associate = (models) => {
    Topic.belongsTo(models.User);
  };

  return Topic;
};
