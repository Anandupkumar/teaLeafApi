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

const Users = sequelize.define("users", {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   },
   first_name: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   last_name: {
      type: DataTypes.STRING,
      allowNull: true,
   },
   email: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   phone: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   user_type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "1-Admin, 2-Customer",
   },
   password: {
      type: Sequelize.STRING,
      allowNull: true,
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

Users.belongsTo(
   Users,
   {
      foreignKey: "created_by",
      as: "createdBy",
   },
   {
      foreignKey: "updated_by",
      as: "updatedBy",
   }
);

const createNewAdminUser = async (data) => {
   const result = await Users.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      user_type: 1
   });
   return result;
};

const getAdminUserByEmail = async (email) => {
   const result = await Users.findOne({
      where: { email: email },
   });
   return result;
};

const getUserDetailsWithPhone = async (phone) => {
   const result = await Users.findOne({
      where: { phone: phone },
   });
   return result;
};

sequelize
   .sync()
   .then(() => {
      console.log("Users table created successfully!");
   })
   .catch((error) => {
      console.error("Unable to create table : ", error);
   });

module.exports = {
   Users,
   createNewAdminUser,
   getAdminUserByEmail,
   getUserDetailsWithPhone,
};
