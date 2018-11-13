const Job_model = require("../models/job_model");
const users = require("../models/users");
const customExceptions = require("../custom_exceptions/application_exceptions");
const logger = require("../helpers/logger");
const dbRAWQueries = require("../db_raw_queries");
const utility = require("../lib/utility");
const rawQueries = require("../db_raw_queries");
const sequelize = require("./db_base").sequelize;
var dateFormat = require('dateformat');
const Op = sequelize.Op;

function RegisterDao() {}

RegisterDao.prototype.createNewJob = (jobDetailsObject) => {

	return new Promise(async (resolve, reject) => {
		try {
			let result = await Job_model.create(jobDetailsObject);
			if (true) {
				logger.info(" createNewJob Result " + result + " file: " + __filename);
				resolve(result);
			} else {
				logger.info("Exception in createNewJob " + error);
				reject(customExceptions.ApplicationDoesNotExist);
			}
		} catch (error) {
			logger.info("Error in createNewJob " + error + " file: " + __filename);
			reject(error);
		}

	});
};

RegisterDao.prototype.createJobHistory = (jobHistoryObject) => {

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

RegisterDao.prototype.getAllEnabledJobs = () => {
	let currentDate = new Date();
	let date = new Date();
	date = currentDate;
	currentDate.setMinutes(date.getMinutes() - 1);
	console.log(currentDate);
	return new Promise(async (resolve, reject) => {
		try {
			//let query = dbRAWQueries.getUserGroups(userID,applicationID);
			let result = await Job_model.findAll({
				where: {
					status: new utility().ENABLED,
					next_run_time: {
						[Op.gte]: currentDate
					}

					//Op.between: [6, 10],  


				}
			});
			logger.info("All Enabled Jobs: " + result + " File Location: " + __filename);
			console.log("All Enabled Jobs: " + result + " File Location: " + __filename);

			resolve(result);
		} catch (error) {
			logger.info(error + "Error in getAllEnabledJobs " + __filename);
			console.log(error + "Error in getAllEnabledJobs " + __filename);
			reject(error);
		}
	});
};



RegisterDao.prototype.updateRecordAfterExecutionOfJob = (jobObjectData, jobId) => {
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
					id: jobId
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

RegisterDao.prototype.getAllJobHsitory = () => {
	logger.info("Entry in getAllJobHsitory(): ");
	return new Promise(async (resolve, reject) => {
		try {

			let query = rawQueries.getAllHistory();
			let result = await sequelize.query(query, {
				type: sequelize.QueryTypes.SELECT
			});
			logger.info("All JobHistory: " + JSON.stringify(result));

			for (let i = 0; i < result.length; i++) {

				result[i].status = new utility().convertJobHistoryRunStatusInResponseFormat(result[i].run_status);
				//convert last run status
				result[i].last_run_status = new utility().consvertJobLastRunStatus(result[i].last_run_status);

				result[i].start_date_time = new utility().convertDateFormat(result[i].start_date_time);
			}
			resolve(result);
		} catch (error) {
			logger.info("Entry in getAllJobHsitory(): " + error);
		}


	})

}

RegisterDao.prototype.getAllJobHsitoryOnCreatedDate = (startDate, endDate) => {
	logger.info("Entry in getAllJobHsitory(): ");
	return new Promise(async (resolve, reject) => {
		try {
			let query = rawQueries.getAllHistoryOnCreatedDate(startDate, endDate);
			let result = await sequelize.query(query, {
				type: sequelize.QueryTypes.SELECT
			});
			logger.info("All JobHistory: " + JSON.stringify(result));

			for (let i = 0; i < result.length; i++) {

				result[i].status = new utility().convertJobHistoryRunStatusInResponseFormat(result[i].run_status);
				//convert last run status
				result[i].last_run_status = new utility().consvertJobLastRunStatus(result[i].last_run_status);

				result[i].start_date_time = new utility().convertDateFormat(result[i].start_date_time);
			}
			resolve(result);
		} catch (error) {
			logger.info("Entry in getAllJobHsitory(): " + error);
		}


	})

}

RegisterDao.prototype.getAllRunningJobs = () => {
	logger.info("Entry in getAllRunningJobs(): ");
	return new Promise(async (resolve, reject) => {
		try {

			let query = rawQueries.getAllRunningJobs();
			let result = await sequelize.query(query, {
				type: sequelize.QueryTypes.SELECT
			});
			logger.info("All JobHistory: " + JSON.stringify(result));
			for (let i = 0; i < result.length; i++) {
				//convert job status in respose format
				result[i].status = new utility().convertJobStatusInResponse(result[i].status)

				//to change date format of start date time
				result[i].start_date_time = new utility().convertDateFormat(result[i].start_date_time);

				//to change date format of  run date time
				result[i].run_date_time = new utility().convertDateFormat(result[i].run_date_time);

				//to change date format of last run time
				result[i].last_run_time = new utility().convertDateFormat(result[i].last_run_time);

				//to chnage job status
				result[i].status = new utility().convertJobStatusInResponse(result[i].status);

				//to change last_run_status
				result[i].last_run_status = new utility().consvertJobLastRunStatus(result[i].last_run_status);

				//to chnage schuler type
				result[i].scheduler_type = new utility().convertSchedulerTypeInResponseFromat(result[i].scheduler_type);

			}
			resolve(result);
		} catch (error) {
			logger.info("Entry in getAllJobHsitory(): " + error);
			console.log("Entry in getAllJobHsitory(): " + error);
		}


	})

}


RegisterDao.prototype.getAllJobsExecutedToday = () => {
	logger.info("Entry in getAllJobHsitory(): ");
	return new Promise(async (resolve, reject) => {
		try {

			let query = rawQueries.getAllJobsExecutedToday();
			let result = await sequelize.query(query, {
				type: sequelize.QueryTypes.SELECT
			});
			logger.info("All JobHistory: " + JSON.stringify(result));
			for (let i = 0; i < result.length; i++) {
				//convert job status in respose format
				result[i].last_run_status = new utility().consvertJobLastRunStatus(result[i].last_run_status)

				//to change date format of start date time
				result[i].start_date_time = new utility().convertDateFormat(result[i].start_date_time);

				//to change date format of next run time
				result[i].next_run_time = new utility().convertDateFormat(result[i].next_run_time);

				//to change date format of last run time
				result[i].last_run_time = new utility().convertDateFormat(result[i].last_run_time);

				//to chnage schuler type
				result[i].scheduler_type = new utility().convertSchedulerTypeInResponseFromat(result[i].scheduler_type);


			}
			resolve(result);
		} catch (error) {
			logger.info("Entry in getAllJobHsitory(): " + error);
		}


	})

}

RegisterDao.prototype.getJobOnId = (jobID) => {
	logger.info("Entry into getJobById()")
	return new Promise(async (resolve, reject) => {
		try {

			let result = await Job_model.findAll({
				where: {
					id: jobID
				}
			});
			logger.info("Job Details: " + JSON.stringify(result));

			resolve(result);
		} catch (error) {
			logger.info("Entry in getAllJobs(): " + error);
		}
	})
}


RegisterDao.prototype.getAllJobs = () => {
	logger.info("Entry in getAllJobs(): ");
	return new Promise(async (resolve, reject) => {
		try {

			let query = rawQueries.getAllJobs();
			let result = await sequelize.query(query, {
				type: sequelize.QueryTypes.SELECT
			});
			logger.info("All getAllJobs: " + JSON.stringify(result));
			for (let i = 0; i < result.length; i++) {

				result[i].status = new utility().convertJobStatusInResponse(result[i].status);
				//convert last run status
				result[i].last_run_status = new utility().consvertJobLastRunStatus(result[i].last_run_status);

				result[i].scheduler_type = new utility().convertSchedulerTypeInResponseFromat(result[i].scheduler_type);

				//to change date format of succeful last run time
				result[i].successful_last_run_time = new utility().convertDateFormat(result[i].successful_last_run_time);

				//to change date format of start date time
				result[i].start_date_time = new utility().convertDateFormat(result[i].start_date_time);

				//to change date format of last run time
				result[i].last_run_time = new utility().convertDateFormat(result[i].last_run_time);

				//to change date format of end date time
				result[i].end_date_time = new utility().convertDateFormat(result[i].end_date_time);




				//to change date format of next run time
				result[i].next_run_time = new utility().convertDateFormat(result[i].next_run_time);

			}
			resolve(result);
		} catch (error) {
			logger.info("Entry in getAllJobs(): " + error);
		}


	})

}




module.exports = RegisterDao;