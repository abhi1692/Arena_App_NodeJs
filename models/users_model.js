const sequelize = require("../dao/db_base").sequelize;
const Sequelize = require("sequelize");

const Users = sequelize.define(
	"Users", {
		id: {
			type: Sequelize.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			field: "id"
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: "",
			field: "name"
		},
		phone_number: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: "",
			field: "phone_number"
		},
		email_id: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: "",
			field: "email_id"
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
		tableName: "Users",
		createdAt: false,
		updatedAt: false
	}
);

module.exports = Users;