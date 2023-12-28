module.exports = (sequelize, DataTypes) => {
  const CommentTopic = sequelize.define('CommentTopic', {
    // Define attributes if necessary
  });

  CommentTopic.associate = (models) => {
    CommentTopic.belongsTo(models.Comment);
    CommentTopic.belongsTo(models.Topic);
  };

  return CommentTopic;
};