module.exports = (sequelize, DataTypes) => {
  const CommentTopic = sequelize.define('CommentTopic', {
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  CommentTopic.associate = (models) => {
    CommentTopic.belongsTo(models.Comment, {
      foreignKey: 'commentId',
    });
    CommentTopic.belongsTo(models.Topic, {
      foreignKey: 'topicId',
    });
  };
  
  return CommentTopic;
};