module.exports = (sequelize, DataTypes) => {
  const GameOptionsRel = sequelize.define("GameOptionsRel", {
    // Define attributes if necessary
  });

  GameOptionsRel.associate = (models) => {
    GameOptionsRel.belongsTo(models.Game);
    GameOptionsRel.belongsTo(models.GameOptions);
  };

  return GameOptionsRel;
};
