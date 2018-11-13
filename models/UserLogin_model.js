const sequelize = require("../dao/db_base").sequelize;
const Sequelize = require("sequelize");

const UserLogin = sequelize.define(
    "UserLogin", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: "id"
        },
        user_id: {
            type: Sequelize.BIGINT,
            references: 'Users', //, <<< Note, its table's name, not object name
            referencesKey: 'id',
            allowNull: false,
            defaultValue: 0,
            field: "user_id"
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
            field: "username"
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
            field: "password"
        },
        created_by: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "system",
            field: "created_by"
        },
        updated_by: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "system",
            field: "updated_by"
        }
    }, {
        tableName: "UserLogin",
        createdAt: false,
        updatedAt: false
    }
);

module.exports = UserLogin;