const RegisetrDao = require("../dao/registerDao");
const ResponseHandler = require("../helpers/response_handler");
const logger = require('../helpers/logger');
var schedule = require('node-schedule');
var jobObject = require('../view_object/job'); 
var utility = require('../lib/utility');
var dateFormat = require('dateformat');
const ScheduleJobService = require('../services/schedule_job_service');
var findRemoveSync = require('find-remove');
var fs = require('fs');
var config = require('../config/config.json');
//const Util = require('../lib/utility.js')

//const guid = require("guid");



function RegisterService() { }


//Regisetr job for more than once a day
RegisterService.prototype.createNewJobForMoreThanOnceADay = async (req, res) => {

	logger.info("inside createNewJob_moreThanOnceADay");

	try {
		let recievedData = req.body.requestObject;
		jobDetails = new utility().getJobDetails(recievedData);
		//jobDetails.job_api = 'http://localhost:4000/api/v1/testService';
		logger.info("Data recieved=" + JSON.stringify(req.body.requestObject));
		let result = await new RegisetrDao().createNewJob(jobDetails);

		new ResponseHandler().successHandler(res,200,"success","requestID");
	} catch (error) {
		//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
		logger.error("Error in createNewJobForMoreThanOnceADay : "+error);
		new ResponseHandler().errorHandler(res, error, "requestID");
	}

};

//update job Details
RegisterService.prototype.updateJobDetails = async (req, res) => {
	
		logger.info("inside updateJobDetails");
	
		try {
			let recievedJobDataToUpdate = req.body.requestObject;
			let updatedJobId = req.params.id;
			let jobDetailFromDB = await new RegisetrDao().getJobOnId(updatedJobId);
			jobDetailsToUpdate = new utility().getJobDetailsForUpdate(jobDetailFromDB, recievedJobDataToUpdate);
			//logger.info("Data recieved=" + JSON.stringify(req.body.requestObject));
			let result = await new RegisetrDao().updateRecordAfterExecutionOfJob(jobDetailsToUpdate,updatedJobId);
	
			new ResponseHandler().successHandler(res,200,"success","requestID");
		} catch (error) {
			//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
			logger.error("Error in updateJobDetails : "+error);
			console.log("Error in updateJobDetails : "+error.sql);
			new ResponseHandler().errorHandler(res, error, "requestID");
		}
	
	};

RegisterService.prototype.getJobOnId = async (req, res)=>{
	
		logger.info("inside getJobOnId");
		try {
			let jobId = req.params.id
			let result = await new RegisetrDao().getJobOnId(jobId);
			new ResponseHandler().successHandler(res,200,result,"requestID");
		} catch (error) {
			//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
			logger.error("Error in createNewJobForMoreThanOnceADay : "+error);
			new ResponseHandler().errorHandler(res, error, requestID);
		}
	};

RegisterService.prototype.runTaskOnDemand = async (req, res)=>{

	logger.info("inside runTaskOnDemand");
	try {
		let recievedJobData = req.body.requestObject;
		let jobDetails = await new RegisetrDao().getJobOnId(recievedJobData.id);
		jobDetails[0].isRunOnDemand = true;
		let result = await new ScheduleJobService().runOnDemand(jobDetails[0]);
		new ResponseHandler().successHandler(res,200,result,"requestID");
	} catch (error) {
		//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
		logger.error("Error in createNewJobForMoreThanOnceADay : "+error);
		new ResponseHandler().errorHandler(res, error, requestID);
	}
};

RegisterService.prototype.getAllJobs = async (req, res) => {
	logger.info("inside getHistory");
	try {
		let result = await new RegisetrDao().getAllJobs();
		new ResponseHandler().successHandler(res,200,result,"requestID");
	} catch (error) {
		//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
		logger.error("Error in createNewJobForMoreThanOnceADay : "+error);
		new ResponseHandler().errorHandler(res, error, requestID);
	}

};

RegisterService.prototype.getHistory = async (req, res) => {
		logger.info("inside getHistory");
		try {
			let result = await new RegisetrDao().getAllJobHsitory();
			new ResponseHandler().successHandler(res,200,result,"requestID");
		} catch (error) {
			//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
			logger.error("Error in createNewJobForMoreThanOnceADay : "+error);
			new ResponseHandler().errorHandler(res, error, requestID);
		}
	
	};

	RegisterService.prototype.getHistoryOnCreatedDate = async (req, res) => {
		logger.info("inside getHistory");
		try {
			let startDate = new utility().convertStartDateInSearchCriteriaForm(req.params.startDate);
			let endDate = new utility().convertEndDateInSearchCriteriaForm(req.params.endDate);		
			let result = await new RegisetrDao().getAllJobHsitoryOnCreatedDate(startDate,endDate);
			new ResponseHandler().successHandler(res,200,result,"requestID");
		} catch (error) {
			//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
			logger.error("Error in createNewJobForMoreThanOnceADay : "+error);
			new ResponseHandler().errorHandler(res, error, requestID);
		}
	
	};

	RegisterService.prototype.getAllJobsExecutedToday = async (req, res) => {
		logger.info("inside getAllJobsExecutedToday");
		try {
			let result = await new RegisetrDao().getAllJobsExecutedToday();
			new ResponseHandler().successHandler(res,200,result,"requestID");
		} catch (error) {
			//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
			logger.error("Error in getAllJobsExecutedToday : "+error);
			new ResponseHandler().errorHandler(res, error, requestID);
		}
	
	};

	RegisterService.prototype.getAllRunningJobs = async (req, res) => {
		logger.info("inside getAllRunningJobs");
		try {
			let result = await new RegisetrDao().getAllRunningJobs();
			new ResponseHandler().successHandler(res,200,result,"requestID");
		} catch (error) {
			//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
			logger.error("Error in getAllJobsExecutedToday : "+error);
			new ResponseHandler().errorHandler(res, error, requestID);
		}
	
	};
	

RegisterService.prototype.testService = async (req, res) => {
	
	
		console.log('waiiting');
		logger.info("inside testService");
		
			try {
				for(let i = 0 ; i<100 ; i++){
					console.log(i);
				}
				let dir = fs.readdirSync('./JOB_SCHEDULER_Node/test_delete_folder');
				var result = findRemoveSync(config.DeletefileConfig.deleteFilesFolderPath, {age: {seconds: config.DeletefileConfig.timeInSeconds},extensions: config.DeletefileConfig.deleteFileExtensions, limit: config.DeletefileConfig.NumberOfFileDeleteAtOnce})
				
				new ResponseHandler().successHandler(res,200,"success","requestID");
	
			} catch (error) {
				//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
				logger.error("Error in createNewJobForMoreThanOnceADay : "+error);
				new ResponseHandler().errorHandler(res, error, "requestID");
			}
	
	
	
	};



// //Regisetr job for daily
// RegisterService.prototype.createNewJobForDaily = async (req, res) => {
	
// 		logger.info("inside createNewJob_daily");
	
// 		try {
			 
// 			let recievedData = req.body.requestObject;
// 			jobDetails = new utility().getJobDetails(recievedData);
// 			jobDetails.job_api = req.originalUrl;
// 			logger.info("Data recieved=" + JSON.stringify(req.body.requestObject));
// 			let result = await new RegisetrDao().createNewJob(jobDetails);
	
// 			new ResponseHandler().successHandler(res,200,"success","requestID");
// 		} catch (error) {
// 			//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
// 			logger.error("Error in createNewJob_daily : "+error);
// 			new ResponseHandler().errorHandler(res, error, requestID);
// 		}
	
// 	};

// //Regisetr job for weekly
// RegisterService.prototype.createNewJobForWeekly = async (req, res) => {
	
// 		logger.info("inside createNewJob_daily");
	
// 		try {
			 
// 			let recievedData = req.body.requestObject;
// 			jobDetails = new utility().getJobDetails(recievedData);
// 			jobDetails.job_api = req.originalUrl;
// 			logger.info("Data recieved=" + JSON.stringify(req.body.requestObject));
// 			let result = await new RegisetrDao().createNewJob(jobDetails);
	
// 			new ResponseHandler().successHandler(res,200,"success","requestID");
// 		} catch (error) {
// 			//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
// 			logger.error("Error in createNewJob_daily : "+error);
// 			new ResponseHandler().errorHandler(res, error, requestID);
// 		}
	
// 	};

// //Regisetr job for Monthly
// RegisterService.prototype.createNewJobForMonthly = async (req, res) => {
	
// 		logger.info("inside createNewJob_Monthly");
	
// 		try {
			 
// 			let recievedData = req.body.requestObject;
// 			jobDetails = new utility().getJobDetails(recievedData);
// 			jobDetails.job_api = req.originalUrl;
// 			logger.info("Data recieved=" + JSON.stringify(req.body.requestObject));
// 			let result = await new RegisetrDao().createNewJob(jobDetails);
	
// 			new ResponseHandler().successHandler(res,200,"success","requestID");
// 		} catch (error) {
// 			//	new LoggerHelper().error(method,"Inside catch block",requestID,__filename,error);
// 			logger.error("Error in createNewJob_daily : "+error);
// 			new ResponseHandler().errorHandler(res, error, requestID);
// 		}
	
// 	};


module.exports = RegisterService;