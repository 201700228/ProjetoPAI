module.exports = (sequelize, DataTypes) => {
  const Forum = sequelize.define('Forum', {
    // Define attributes if necessary
  });

  Forum.associate = (models) => {
    Forum.belongsTo(models.Game);
    Forum.belongsTo(models.Topic);
  };

  return Forum;
};