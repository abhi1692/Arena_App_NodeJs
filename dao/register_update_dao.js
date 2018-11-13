const users = require("../models/users");
const dbRAWQueries = require("../db_raw_queries");
const sequelize = require("../dao/db_base").sequelize;
//const LoggerHelper = require("../helpers/logger_helper");
const Job_model = require("../models/job_model");
const logger = require("../helpers/logger");


function JobUpdate() {}

JobUpdate.prototype.updateJob = (jobObjectData) => {
	logger.info("Inside updateRecordAfterExecutionOfJob " + __filename);
	return new Promise(async (resolve, reject) => {
		try {

			let result = await Job_model.update({
				job_name: jobObjectData.job_name,
				description: jobObjectData.description,
				scheduler_type: jobObjectData.scheduler_type,
				run_on_weekends: jobObjectData.run_on_weekends,
				start_date_time: jobObjectData.start_date_time,
				end_date_time: jobObjectData.end_date_time,
				start_time: jobObjectData.start_time,
				end_time: jobObjectData.end_time,
				day_number: jobObjectData.day_number,
				time_of_day: jobObjectData.time_of_day,
				repeat_interval: jobObjectData.repeat_interval,
				times_triggered: jobObjectData.times_triggered,
				job_api: jobObjectData.job_api,
				mail_to: jobObjectData.mail_to,
				log_level: jobObjectData.log_level,
				successful_last_run_time: jobObjectData.successful_last_run_time,
				last_run_status: jobObjectData.last_run_status,
				last_run_time: jobObjectData.last_run_time,
				next_run_time: jobObjectData.next_run_time,
				status: jobObjectData.status,
				created_date: jobObjectData.created_date,
				updated_date: jobObjectData.updated_date,
				created_by: jobObjectData.created_by,
				updated_by: jobObjectData.updated_by
			}, {
				where: {
					id: jobObjectData.id
				}
			});

			resolve(result);
		} catch (error) {
			logger.info("Error in updateRecordAfterExecutionOfJob " + __filename);
			console.log("Error in updateRecordAfterExecutionOfJob " + __filename);
			reject(error);
		}
	});
};

JobUpdate.prototype.updateJobHistory = (jobHistoryObject) => {
	return new Promise(async (resolve, reject) => {
		try {

			let result = await users.update({
				job_id: jobHistoryObject.job_id,
				run_date_time: jobHistoryObject.run_date_time,
				run_status: jobHistoryObject.run_status,
				user_id: jobHistoryObject.user_id,
				job_data: jobHistoryObject.job_data,
				time_spent: jobHistoryObject.time_spent,
				created_date: jobHistoryObject.created_date,
				updated_date: jobHistoryObject.updated_date,
				created_by: jobHistoryObject.created_by,
				updated_by: jobHistoryObject.updated_by
			}, {
				where: {
					job_id: jobHistoryObject.job_id
				}
			});

			resolve(result);
		} catch (error) {
			logger.info("Error in updateRecordAfterExecutionOfJob " + __filename);
			console.log("Error in updateRecordAfterExecutionOfJob " + __filename);
			reject(error);
		}
	})
}

JobUpdate.prototype.createJobHistory = (jobHistoryObject) => {

	return new Promise(async (resolve, reject) => {
		try {
			let result = await users.create(jobHistoryObject);
			if (true) {
				logger.info(" createJobHistory Result " + result + " file: " + __filename);
				resolve(result);
			} else {
				logger.info("Exception in createJobHistory " + error);
				reject(customExceptions.ApplicationDoesNotExist);
			}
		} catch (error) {
			logger.info("Error in createJobHistory " + error + " file: " + __filename);
			reject(error);
		}

	});
};

JobUpdate.prototype.isUserAuthorizedToAccessScreen = (userID, screenID, applicationID, requestID) => {
	let method = "isUserAuthorizedToAccessScreen";
	new LoggerHelper().info(method, "Inside " + method, requestID, __filename);
	return new Promise(async (resolve, reject) => {
		try {
			let query = dbRAWQueries.getUserScreensByUserIDApplicationIDAndScreenID(userID, applicationID, screenID);
			let result = await sequelize.query(query, {
				type: sequelize.QueryTypes.SELECT
			});
			new LoggerHelper().info(method, "Before returning result", requestID, __filename);
			if (result.length > 0)
				resolve(true);
			else
				resolve(false);
		} catch (error) {
			new LoggerHelper().error(method, "Inside catch block", requestID, __filename, error);
			reject(error);
		}
	});
};


module.exports = JobUpdate;