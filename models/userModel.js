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
   //   created_at: {
   //     type: Sequelize.DATE(3),
   //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
   //   },
   //   updated_at: {
   //     type: Sequelize.DATE(3),
   //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
   //   },
   //   created_by: {
   //     type: DataTypes.INTEGER,
   //     references: {
   //       model: Users,
   //       key: "id",
   //     },
   //     allowNull: false,
   //   },
   //   updated_by: {
   //     type: DataTypes.INTEGER,
   //     references: {
   //       model: Users,
   //       key: "id",
   //     },
   //     allowNull: false,
   //   },
});

const createNewAdminUser = async (data) => {
   const result = await Users.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      user_type: 1,
   });
   return result;
};

const getAdminUserByEmail = async (email) => {
   const result = await Users.findOne({
      where: { email: email },
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

module.exports = { Users, createNewAdminUser, getAdminUserByEmail };
