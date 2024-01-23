module.exports = (sequelize, DataTypes) => {
  const GameOptionsRel = sequelize.define("GameOptionsRel", {
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameOptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  GameOptionsRel.associate = (models) => {
    GameOptionsRel.belongsTo(models.Game, {
      foreignKey: 'gameId',
    });
    GameOptionsRel.belongsTo(models.GameOptions, {
      foreignKey: 'gameOptionId',
    });
  };

  return GameOptionsRel;
};
