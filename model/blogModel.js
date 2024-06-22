module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define("blog", {
    title: {
      type: DataTypes.STRING,
      allowNull : false,
    },
    subTitle: {
      type: DataTypes.STRING,  
    },
    content: {
      type: DataTypes.TEXT,
      allowNull : false,
    },
    image : {
      type : DataTypes.STRING
    }

  });
  return Blog;
};
defaultValue: 'defaultProfilePictureUrl.jpg' // Provide a default image if none is uploaded