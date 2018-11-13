const sequelize = require("../dao/db_base").sequelize;
const Sequelize = require("sequelize");

const JobModel = sequelize.define(
	"job", {
		id: {
			type: Sequelize.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			field: "id"
		},
		job_name: {
			type: Sequelize.STRING,
			allowNull: false,
			field: "job_name"
		},
		description: {
			type: Sequelize.STRING,
			allowNull: true,
			field: "description"
		},
		scheduler_type: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
			field: "scheduler_type"
		},
		run_on_weekends: {
			type: Sequelize.TINYINT,
			allowNull: false,
			defaultValue: 0,
			field: "run_on_weekends"
		},
		start_date_time: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: 0,
			field: "start_date_time"
		},
		end_date_time: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: null,
			field: "end_date_time"
		},
		start_time: {
			type: Sequelize.STRING,
			allowNull: true,
			field: "start_time"
		},
		end_time: {
			type: Sequelize.STRING,
			allowNull: true,
			field: "end_time"
		},
		day_number: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 0,
			field: "day_number"
		},
		time_of_day: {
			type: Sequelize.TIME,
			allowNull: true,
			defaultValue: 0,
			field: "time_of_day"
		},
		repeat_interval: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: 0,
			field: "repeat_interval"
		},
		times_triggered: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 0,
			field: "times_triggered"
		},
		job_api: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: 0,
			field: "job_api"
		},
		mail_to: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: 0,
			field: "mail_to"
		},
		log_level: {
			type: Sequelize.TINYINT,
			allowNull: true,
			defaultValue: 0,
			field: "log_level"
		},
		successful_last_run_time: {
			type: Sequelize.TIME,
			allowNull: true,
			defaultValue: 0,
			field: "successful_last_run_time"
		},
		last_run_status: {
			type: Sequelize.TINYINT,
			allowNull: false,
			defaultValue: 0,
			field: "last_run_status"
		},
		last_run_time: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: 0,
			field: "last_run_time"
		},
		next_run_time: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: 0,
			field: "next_run_time"
		},
		status: {
			type: Sequelize.TINYINT,
			allowNull: false,
			defaultValue: 0,
			field: "status"
		},
		created_date: {
			type: Sequelize.DATE,
			allowNull: false,
			field: "created_date"
		},
		updated_date: {
			type: Sequelize.DATE,
			allowNull: false,
			field: "updated_date"
		},
		created_by: {
			type: Sequelize.INTEGER,
			allowNull: true,
			field: "created_by"
		},
		updated_by: {
			type: Sequelize.INTEGER,
			allowNull: true,
			field: "updated_by"
		},

	}, {
		tableName: "job",
		createdAt: false,
		updatedAt: false
	}
);

module.exports = JobModel;