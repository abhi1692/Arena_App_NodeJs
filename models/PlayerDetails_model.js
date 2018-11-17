const sequelize = require("../dao/db_base").sequelize;
const Sequelize = require("sequelize");
const PlayerDetails = sequelize.define(

    "players_dtls", {
        pd_id: {
            type: Sequelize.NUMERIC,
            primaryKey: true,
            autoIncrement: true,
            field: "pd_id"
        },
        pd_name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "admin",
            field: "pd_name"
        },
        pd_email_id: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
            field: "pd_email_id"
        },
        pd_mobile_no: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "0000",
            field: "pd_mobile_no"
        },
        pd_user_name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
            field: "pd_user_name"
        },
        pd_password: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
            field: "pd_password"
        },
        pd_created_on: {

            type: Sequelize.DATE,
            allowNull: true,
            //defaultValue: new Date(),
            field: "pd_created_on"
        }
    }, {
        tableName: "players_dtls",
        createdAt: false,
        updatedAt: false
    }
);

module.exports = PlayerDetails;