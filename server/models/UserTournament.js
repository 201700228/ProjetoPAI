module.exports = (sequelize, DataTypes) => {
  const UserTournament = sequelize.define('UserTournament', {
    // Define attributes if necessary
  });

  UserTournament.associate = (models) => {
    UserTournament.belongsTo(models.User);
    UserTournament.belongsTo(models.Tournament);
  };

  return UserTournament;
};