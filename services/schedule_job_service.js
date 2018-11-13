const RegisetrDao = require("../dao/registerDao");
const ResponseHandler = require("../helpers/response_handler");
const logger = require('../helpers/logger');
const loggerHelper = require('../lib/logger_helper');
var schedule = require('node-schedule');
var jobObjectVO = require('../view_object/job');
var utility = require('../lib/utility');
var dateFormat = require('dateformat');
var _ = require("lodash");
var jobHistoryVO = require('../view_object/job_history');

function ScheduleJob() { }

ScheduleJob.prototype.scheduleJobForTasks = async function () {

	logger.info("inside schedule_job_service - function:scheduleJobForTasks");

	try {
		let jobObject = await new RegisetrDao().getAllEnabledJobs();
		logger.info("All Enable jobs: " + jobObject);
		for (var i = 0; i < jobObject.length; i++) {
			if(jobObject[i].scheduler_type == new utility().MORE_THAN_ONCE_A_DAY)
			{
				scheduleJobForMoreThanOnceADay(jobObject[i]);
			}else if(jobObject[i].scheduler_type == new utility().DAILY)
			{
				scheduleJobForDaily(jobObject[i]);
			}else if(jobObject[i].scheduler_type == new utility().WEEKLY)
			{
				scheduleJobForWeekly(jobObject[i]);
			}else if(jobObject[i].scheduler_type == new utility().MONTHLY)
			{
				scheduleJobForMonthly(jobObject[i]);
			}else if(jobObject[i].scheduler_type == new utility().NEVER)
			{
				//scheduleJobForNever(jobObject[i]);
			}

		}


	} catch (error) {
		logger.info("error in scheduleJobForTasks: " + error)
	}

};


var scheduleJobForMoreThanOnceADay = async function (jobObjectData) {
	try{
	let currentTime = new Date();
	let currentMinute = currentTime.getMinutes();
	let currentHours = currentTime.getHours();
	let currentDate = currentTime.getDate();
	let currentYear = currentTime.getFullYear();
	let currentMonth = currentTime.getMonth();
	let currentDay = currentTime.getDay();
	let nextJobRunTime = new Date(jobObjectData.next_run_time);
	let endDateTime = new Date(jobObjectData.end_date_time);
	let startTime;
	let endTime
	if (jobObjectData.start_time != null) {
		startTime = jobObjectData.start_time.split(":");
		endTime = jobObjectData.end_time.split(":");
	}
	let startDateTime = new Date(jobObjectData.start_date_time);
	let nextJobMinute = nextJobRunTime.getMinutes();
	let nextJobHours = nextJobRunTime.getHours();
	let nextJobDate = nextJobRunTime.getDate();
	if ((endDateTime != null || endDateTime != new utility().DEFAULT_DATE)) {

		// let jobDetailsToUpdate = new jobObjectVO();//This update will be push into database after execution
		// jobDetailsToUpdate = jobObjectData;
		if (currentTime.getDate() == nextJobRunTime.getDate() && currentTime.getMonth() == nextJobRunTime.getMonth() && currentTime.getFullYear() == nextJobRunTime.getFullYear() && currentTime.getHours() == nextJobRunTime.getHours()) {
			if (jobObjectData.start_time == null) {
				if (currentTime.getMinutes() == parseInt(nextJobMinute)) {
					logger.info(__filename + " Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
					console.log("Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
					let startTaskTime = new Date();
					let taskStatus = await new utility().runTask(jobObjectData);
					

				}
			} else {

				if (currentTime.getHours() >= parseInt(startTime[0]) && currentTime.getHours() <= parseInt(endTime[0])) {
					if (currentTime.getMinutes() >= parseInt(startTime[1]) && currentTime.getMinutes() <= parseInt(endTime[1])) {
						if (currentTime.getMinutes() == parseInt(nextJobMinute)) {
							logger.info(__filename + " Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
							console.log("Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
							let startTaskTime = new Date();
							let taskStatus = await new utility().runTask();
							
						} else {
							logger.info("Job Not Schedule -- Current Time(minute): " + currentTime.getMinutes() + " And Job Run Time(Minute): " + nextJobMinute + " job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
							console.log("Job Not Schedule -- Current Time(minute): " + currentTime.getMinutes() + " And Job Run Time(Minute): " + nextJobMinute + " job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
						}
					} else {
						logger.info("Job Not Schedule -- As not in between startTime and End Time." + "Job Time: " + jobObjectData.next_run_time + "Job Satrt Time: " + jobObjectData.start_time + " And Job End Time " + jobObjectData.end_time + " job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
						console.log("Job Not Schedule -- As not in between startTime and End Time." + "Job Time: " + jobObjectData.next_run_time + "Job Satrt Time: " + jobObjectData.start_time + " And Job End Time " + jobObjectData.end_time + " job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
					}
				}
			}
		} else {
			logger.info("Job Not Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
			console.log("Job Not Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
		}
	}
	//}
}catch(error){
	logger.info("Errro in scheduleJobForMoreThanOnceADay() "+error);
	console.log("Errro in scheduleJobForMoreThanOnceADay() "+error);
	
	}
}

var scheduleJobForDaily = async function (jobObjectData) {

	try {
		let currentDate = new Date();
		let nextRunTime = new Date(jobObjectData.next_run_time);
		let jobDetailsToUpdate = new jobObjectVO();//This update will be push into database after execution
		jobDetailsToUpdate = jobObjectData;
		if(nextRunTime < jobObjectData.end_date_time){

		if(nextRunTime.getFullYear() == currentDate.getFullYear() && 
		nextRunTime.getMonth() == currentDate.getMonth() &&
		nextRunTime.getDate() == currentDate.getDate()){
			if(nextRunTime.getHours() == currentDate.getHours() ){
				if(nextRunTime.getMinutes() == currentDate.getMinutes()){
				
					logger.info(__filename + " Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
					console.log("Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
					let startTaskTime = new Date();
					let taskStatus = new utility().runTask(jobObjectData);
					
				}else{
					logger.info(__filename + " Job Not Schedule As minute didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
					console.log(__filename + " Job Not Schedule As minute didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
				}
			}else{
				logger.info(__filename + " Job Not Schedule As hours didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
				console.log(__filename + " Job Not Schedule As hours didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
			}
		}else{
			logger.info(__filename + " Job Not Schedule As year/month/day didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
			console.log(__filename + " Job Not Schedule As year/month/day didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
		}
	}else{
		logger.info(__filename + " Job Not Schedule As nextRunTime greater than end date time  --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
		console.log(__filename + " Job Not Schedule As nextRunTime greater than end date time --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
	}
	} catch (error) {
		logger.info("Error in scheduleJobForDaily() "+error +" " + __filename);
	}

}

//here all the weekly schdule jobs will be executed
var scheduleJobForWeekly = async function (jobObjectData) {
	logger.info("Inside scheduleJobForWeekly() " + __filename);
		try {
			let currentDate = new Date();
			let nextRunTime = new Date(jobObjectData.next_run_time);
			let jobDetailsToUpdate = new jobObjectVO();//This update will be push into database after execution
			jobDetailsToUpdate = jobObjectData;
			if(nextRunTime < jobObjectData.end_date_time){
	
			if(nextRunTime.getFullYear() == currentDate.getFullYear() && 
			nextRunTime.getMonth() == currentDate.getMonth() &&
			nextRunTime.getDate() == currentDate.getDate()){
				if(nextRunTime.getHours() == currentDate.getHours() ){
					if(nextRunTime.getMinutes() == currentDate.getMinutes()){
					
						logger.info(__filename + " Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
						console.log("Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
						let startTaskTime = new Date();
						new utility().runTask(jobObjectData);
						
					}else{
						logger.info(__filename + " Job Not Schedule As minute didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
						console.log(__filename + " Job Not Schedule As minute didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
					}
				}else{
					logger.info(__filename + " Job Not Schedule As hours didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
					console.log(__filename + " Job Not Schedule As hours didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
				}
			}else{
				logger.info(__filename + " Job Not Schedule As year/month/day didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
				console.log(__filename + " Job Not Schedule As year/month/day didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
			}
		}else{
			logger.info(__filename + " Job Not Schedule As nextRunTime greater than end date time  --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
			console.log(__filename + " Job Not Schedule As nextRunTime greater than end date time --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
		}
		} catch (error) {
			logger.info("Error in scheduleJobForWeekly() "+error +" " + __filename);
		}
	
	}

	
//here all the weekly schdule jobs will be executed
var scheduleJobForMonthly = async function (jobObjectData) {
	logger.info("Inside scheduleJobForMonthly() " + __filename);
		try {
			let currentDate = new Date();
			let nextRunTime = new Date(jobObjectData.next_run_time);
			let jobDetailsToUpdate = new jobObjectVO();//This update will be push into database after execution
			jobDetailsToUpdate = jobObjectData;
			if(nextRunTime < jobObjectData.end_date_time){
	
			if(nextRunTime.getFullYear() == currentDate.getFullYear() && 
			nextRunTime.getMonth() == currentDate.getMonth() &&
			nextRunTime.getDate() == currentDate.getDate()){
				if(nextRunTime.getHours() == currentDate.getHours() ){
					if(nextRunTime.getMinutes() == currentDate.getMinutes()){
					
						logger.info(__filename + " Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
						console.log("Job Schedule --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time + new Date() + " repeat Interval: " + jobObjectData.repeat_interval);
						let startTaskTime = new Date();
						new utility().runTask(jobObjectData);
						
					}else{
						logger.info(__filename + " Job Not Schedule As minute didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
						console.log(__filename + " Job Not Schedule As minute didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
					}
				}else{
					logger.info(__filename + " Job Not Schedule As hours didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
					console.log(__filename + " Job Not Schedule As hours didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
				}
			}else{
				logger.info(__filename + " Job Not Schedule As year/month/day didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
				console.log(__filename + " Job Not Schedule As year/month/day didnot matched --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
			}
		}else{
			logger.info(__filename + " Job Not Schedule As nextRunTime greater than end date time  --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
			console.log(__filename + " Job Not Schedule As nextRunTime greater than end date time --  " + "job id: " + jobObjectData.id + " job nextJobRunTime: " + jobObjectData.next_run_time);
		}
		} catch (error) {
			logger.info("Error in scheduleJobForMonthly() "+error +" " + __filename);
		}
	
	}

	ScheduleJob.prototype.runOnDemand = function(jobDetails){
		logger.info("Inside Run On Demand");
		new utility().runTask(jobDetails);

	}


module.exports = ScheduleJob;