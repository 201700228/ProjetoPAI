module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.BLOB, 
      allowNull: true, 
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { foreignKey: 'UserId' });
  };

  return User;
};
