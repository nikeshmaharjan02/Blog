module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull : false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull:false
      },
      profilePicture : {
        type: DataTypes.STRING,
        defaultValue: 'defaultProfilePictureUrl.jpg' // Provide a default image if none is uploaded
      }
    
    });
    return User;
  };