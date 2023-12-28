module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });


  return Game;
};
