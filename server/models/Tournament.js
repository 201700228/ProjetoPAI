module.exports = (sequelize, DataTypes) => {
  const Tournament = sequelize.define('Tournament', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    maxPlayers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Tournament;
};
