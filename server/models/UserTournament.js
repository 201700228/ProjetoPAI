module.exports = (sequelize, DataTypes) => {
  const UserTournament = sequelize.define('UserTournament', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tournamentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  UserTournament.associate = (models) => {
    UserTournament.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    UserTournament.belongsTo(models.Tournament, {
      foreignKey: 'tournamentId',
    });
  };

  return UserTournament;
};