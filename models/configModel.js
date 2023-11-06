const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("tealeaf", "root", "", {
   host: "localhost",
   dialect: "mysql",
});

sequelize
   .authenticate()
   .then(() => {
      console.log("Connection has been established successfully.");
   })
   .catch((error) => {
      console.error("Unable to connect to the database: ", error);
   });

const Configuration = sequelize.define("configurations", {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   key: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   value: {
      type: DataTypes.STRING,
      allowNull: true,
   },
   status: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "1-Active, 0-Inactive",
   },
   created_by: {
      type: Sequelize.INTEGER,
      references: {
         model: "users",
         key: "id",
      },
   },
   updated_by: {
      type: Sequelize.INTEGER,
      references: {
         model: "users",
         key: "id",
      },
   },
});

sequelize
   .sync()
   .then(() => {
      console.log("Configuration table created successfully!");
   })
   .catch((error) => {
      console.error("Unable to create table : ", error);
   });

module.exports = {
    Configuration,
};
