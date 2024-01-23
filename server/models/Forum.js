module.exports = (sequelize, DataTypes) => {
  const Forum = sequelize.define('Forum', {
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Forum.associate = (models) => {
    Forum.belongsTo(models.Game, {
      foreignKey: 'gameId',
    });
    Forum.belongsTo(models.Topic, {
      foreignKey: 'topicId',
    });
  };

  return Forum;
};