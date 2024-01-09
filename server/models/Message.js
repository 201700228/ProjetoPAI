module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Add any additional fields that may be needed, ex.: date, user name, profile picture
    });

    return Message;
};