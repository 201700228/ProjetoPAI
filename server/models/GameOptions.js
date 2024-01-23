module.exports = (sequelize, DataTypes) => {
    const GameOptions = sequelize.define('GameOptions', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      picture: {
        type: DataTypes.BLOB, 
        allowNull: true, 
      },
    });
  
  
    return GameOptions;
  };
  