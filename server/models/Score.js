module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define('Score', {
    result: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Score.associate = (models) => {
    Score.belongsTo(models.User);
    Score.belongsTo(models.Game);
  };

  return Score;
};
