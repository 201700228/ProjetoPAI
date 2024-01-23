module.exports = (sequelize, DataTypes) => {
  const Leaderboard = sequelize.define('Leaderboard', {
    result: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    victory: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Leaderboard.associate = (models) => {
    Leaderboard.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Leaderboard.belongsTo(models.Game, {
      foreignKey: 'gameId',
    });
  };

  return Leaderboard;
};
