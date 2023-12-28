module.exports = (sequelize, DataTypes) => {
  const Leaderboard = sequelize.define('Leaderboard', {
    result: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Leaderboard.associate = (models) => {
    Leaderboard.belongsTo(models.User);
    Leaderboard.belongsTo(models.Game);
  };

  return Leaderboard;
};
