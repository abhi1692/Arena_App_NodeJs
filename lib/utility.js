const RegisterDao = require("../dao/register_update_dao");
const emailUtility = require("../lib/email_utility");
var dateFormat = require('dateformat');
var request = require('request');
const logger = require("../helpers/logger");
var jobObject = require('../view_object/job');
var jobObjectVO = require('../view_object/job');
var jobHistoryVO = require('../view_object/job_history');
var config = require('../config/config.json');

class Utility {

    constructor() {
        this.BLANK_STRING = " ";
        this.MORE_THAN_ONCE_A_DAY = 1;
        this.DAILY = 2;
        this.WEEKLY = 3;
        this.MONTHLY = 4;
        this.RUN_JOB_RUN_ON_DEMAND = 5;
        this.MORE_THAN_ONCE_A_DAY_VALUE = "MORE THAN ONCE A DAY";
        this.DAILY_VALUE = "DAILY";
        this.WEEKLY_VALUE = "WEEKLY";
        this.MONTHLY_VALUE = "MONTHLY";
        this.RUN_JOB_RUN_ON_DEMAND_VALUE = "RUN ON DEMAND";
        this.NEVER = 6;
        this.ENABLED = 0;
        this.DISABLED = 1;
        this.ENABLED_VALUE = "ENABLED";
        this.DISABLED_VALUE = "DISABLED";
        this.DEFAULT_DATE = "1970-01-01T00:00:00.000Z"
        this.ALL_DAY = "ALL_DAY";
        this.BETWEEN_TIMES = "BETWEEN_TIMES";
        this.LAST_RUN_STATUS_SUCCESS = 0;
        this.LAST_RUN_STATUS_FAIL = 1;
        this.LAST_RUN_STATUS_NOT_RUN = 2;
        this.LAST_RUN_STATUS_SUCCESS_VALUE = "SUCCESS";
        this.LAST_RUN_STATUS_FAIL_VALUE = "FAIL";
        this.LAST_RUN_STATUS_NOT_RUN_VALUE = "NOT RUN";
        this.TASK_STATUS_SUCCESS = "0";
        this.TASK_STATUS_FAIL = "1";
        this.DEFAULT_END_TIME = new Date("3018-01-01 00:00:00");
        this.JOB_HISTORY_STATUS_SUCCESS = 1;
        this.JOB_HISTORY_STATUS_RUNNING = 2;
        this.JOB_HISTORY_STATUS_FAIL = 3;
        this.JOB_HISTORY_STATUS_SUCCESS_VALUE = "SUCCESS";
        this.JOB_HISTORY_STATUS_RUNNING_VALUE = "RUNNING";
        this.JOB_HISTORY_STATUS_FAIL_VALUE = "FAIL";
        this.RUN_BY_SYSTEM = 0;
    }

    createNextRunTime(registerServiceObject) {
        logger.info("Inside next Run Time");
        console.info("Inside next Run Time");
        try {
            registerServiceObject.end_date_time = new Date(registerServiceObject.end_date_time);
            registerServiceObject.start_date_time = new Date(registerServiceObject.start_date_time);
            let nextRunTime;
            let currentDate = new Date();
            //start create next run for more than once a day
            if (registerServiceObject.scheduler_type == this.MORE_THAN_ONCE_A_DAY || registerServiceObject.scheduler_type == this.MORE_THAN_ONCE_A_DAY_VALUE) {

                let repeatIntervalAfterSplit = registerServiceObject.repeat_interval.split(":");
                console.log("repeatIntervalAfterSplit: " + repeatIntervalAfterSplit);
                logger.info("repeatIntervalAfterSplit: " + repeatIntervalAfterSplit);
                if (registerServiceObject.start_time == null || registerServiceObject.end_time == null) {
                    nextRunTime = new Date(registerServiceObject.start_date_time);
                    nextRunTime.setHours(currentDate.getHours() + parseInt(repeatIntervalAfterSplit[0]));
                    nextRunTime.setMinutes(currentDate.getMinutes() + parseInt(repeatIntervalAfterSplit[1]));
                    nextRunTime = this.runOnWeekends(nextRunTime, registerServiceObject.run_on_weekends);
                } else {
                    let startTime = registerServiceObject.start_time.split(":");
                    //if (currentDate.getFullYear() <= registerServiceObject.end_date_time.getFullYear()) {
                    if (currentDate <= registerServiceObject.end_date_time) {
                        if (currentDate.getDate() == registerServiceObject.start_date_time.getDate() && currentDate.getHours() == registerServiceObject.start_date_time.getHours() && currentDate.getMinutes() >= registerServiceObject.start_date_time.getMinutes()) {
                            nextRunTime = currentDate;
                            registerServiceObject.start_date_time = nextRunTime;
                            nextRunTime.setHours(nextRunTime.getHours() + parseInt(repeatIntervalAfterSplit[0]));
                            nextRunTime.setMinutes(nextRunTime.getMinutes() + parseInt(repeatIntervalAfterSplit[1]));
                            nextRunTime = this.runOnWeekends(nextRunTime, registerServiceObject.run_on_weekends);
                        } else {
                            nextRunTime = new Date(registerServiceObject.start_date_time);
                            nextRunTime.setHours(parseInt(startTime[0]) + parseInt(repeatIntervalAfterSplit[0]));
                            nextRunTime.setMinutes(parseInt(startTime[1]) + parseInt(repeatIntervalAfterSplit[1]));
                            nextRunTime = this.runOnWeekends(nextRunTime, registerServiceObject.run_on_weekends);
                        }

                    } else {
                        //we can make job disable
                        nextRunTime = new Date();
                    }
                }
            }//end of create next run for more than once a day
            else if (registerServiceObject.scheduler_type == this.DAILY || registerServiceObject.scheduler_type == this.DAILY_VALUE) {
                //start of create next run for daily
                console.log("inside createRunJob Daily");
                logger.info("inside createRunJob Daily");
                if (registerServiceObject.start_date_time != null) {
                    nextRunTime = new Date(registerServiceObject.start_date_time);
                    let jobRunTimeAfterSplit = registerServiceObject.start_time.split(":");
                    if (currentDate < registerServiceObject.start_date_time) {
                        nextRunTime.setHours(jobRunTimeAfterSplit[0]);
                        nextRunTime.setMinutes(jobRunTimeAfterSplit[1]);
                        nextRunTime = this.runOnWeekends(nextRunTime, registerServiceObject.run_on_weekends);
                    } else if (currentDate > registerServiceObject.start_date_time) {
                        nextRunTime.setDate(nextRunTime.getDate() + 1);
                        nextRunTime.setHours(jobRunTimeAfterSplit[0]);
                        nextRunTime.setMinutes(jobRunTimeAfterSplit[1]);
                        this.runOnWeekends(nextRunTime, registerServiceObject.run_on_weekends);
                    }

                }

            }//end of create next run for weekly
            else if (registerServiceObject.scheduler_type == this.WEEKLY || registerServiceObject.scheduler_type == this.WEEKLY_VALUE) {
                //start of create next run for WEEKLY
                console.log("inside createRunJob Weekly");
                logger.info("inside createRunJob Weekly");
                let startDate = new Date(registerServiceObject.start_date_time);
                let runTime = new Date(registerServiceObject.start_date_time);
                console.log(" Start Date week: " + startDate.getDay() + " " + " schedule week: " + parseInt(registerServiceObject.dayOfWeek) + " File Location: " + __filename);
                logger.info(" Start Date week: " + startDate.getDay() + " " + " schedule week: " + parseInt(registerServiceObject.dayOfWeek) + " File Location: " + __filename);
                let inEditMode;
                let isNewJob;
                if(registerServiceObject.isEditMode){
                    inEditMode = registerServiceObject.isEditMode;
                    isNewJob = false;
                }else if(registerServiceObject.isNewJob){
                    isNewJob = true;
                    inEditMode = false;
                    
                }else{
                    isNewJob = false;
                    inEditMode = false;
                }

                if (registerServiceObject.times_triggered > 0 && !inEditMode && !isNewJob) {//if job is already run once
                    nextRunTime = new Date(registerServiceObject.next_run_time);
                    nextRunTime.setDate(nextRunTime.getDate() + 7);
                    //nextRunTime.setDate(nextRunTime.getDate() + 7);
                    //nextRunTime = runTime;
                } else {
                    if (startDate > currentDate) {
                        if (startDate.getDay() < parseInt(registerServiceObject.dayOfWeek)) {

                            let diff = parseInt(registerServiceObject.dayOfWeek) - startDate.getDay();
                            runTime.setDate(runTime.getDate() + diff);
                            console.log(runTime);
                        } else if (startDate.getDay() > parseInt(registerServiceObject.dayOfWeek)) {
                            let diff = 7 - startDate.getDay();
                            runTime = registerServiceObject.start_date_time;
                            let dateToSet = runTime.getDate() + diff;
                            runTime.setDate(dateToSet);
                            console.log(dateToSet);
                        } else {
                            runTime = startDate;
                        }
                        nextRunTime = runTime;
                        //runTime = new Date(runTime);
                    }//if startDate > currentDate end here
                    else if (startDate < currentDate) {
                        //runTime = currentDate;
                        runTime = startDate;
                        if (currentDate.getDay() < parseInt(registerServiceObject.dayOfWeek)) {

                            let diff = parseInt(registerServiceObject.dayOfWeek) - currentDate.getDay();
                            runTime.setDate(runTime.getDate() + diff);
                        } else if (currentDate.getDay() > parseInt(registerServiceObject.dayOfWeek)) {
                            let diff = currentDate.getDay() - parseInt(registerServiceObject.dayOfWeek);
                            diff = 7 - diff;
                            runTime.setDate(runTime.getDate() + diff);
                        } else {
                            //if current week day == schduled week
                            startDate.setDate(currentDate.getDate());
                            startDate.setMonth(currentDate.getMonth());
                            startDate.setFullYear(currentDate.getFullYear());
                            //if current time is greater than schdule time
                            if (currentDate > startDate) {

                                currentDate.setDate(currentDate.getDate() + 7);
                                runTime = currentDate;
                            } else {
                                runTime = startDate;
                            }

                        }
                        nextRunTime = runTime;
                    }
                }

            }//end of create next run for MONTHLY
            else if (registerServiceObject.scheduler_type == this.MONTHLY || registerServiceObject.scheduler_type == this.MONTHLY_VALUE) {
                //start of create next run for MONTHLY
                console.log("inside createRunJob MONTHLY");
                logger.info("inside createRunJob MONTHLY");
                let startDate = new Date(registerServiceObject.start_date_time);
                let runTime = new Date(registerServiceObject.start_date_time);
                console.log("Next Run Time: " + runTime);
                console.log(" Start Date week: " + startDate.getDay() + " " + " schedule week: " + parseInt(registerServiceObject.dayOfWeek) + " File Location: " + __filename);
                logger.info(" Start Date week: " + startDate.getDay() + " " + " schedule week: " + parseInt(registerServiceObject.dayOfWeek) + " File Location: " + __filename);
               
                let inEditMode;
                let isNewJob;
                if(registerServiceObject.isEditMode){
                    inEditMode = registerServiceObject.isEditMode;
                    isNewJob = false;
                }else if(registerServiceObject.isNewJob){
                    isNewJob = true;
                    inEditMode = false;
                    
                }else{
                    isNewJob = false;
                    inEditMode = false;
                }

                if (registerServiceObject.times_triggered > 0 && !inEditMode && !isNewJob) {
                    nextRunTime = new Date(registerServiceObject.next_run_time);
                    nextRunTime.setMonth(nextRunTime.getMonth() + 1);
                } else {

                    if (registerServiceObject.start_date_time != null) {
                        nextRunTime = new Date(registerServiceObject.start_date_time);
                        nextRunTime.setDate(parseInt(registerServiceObject.day_number));
                        if (currentDate < nextRunTime) {
                            nextRunTime;


                        } else if (currentDate > registerServiceObject.start_date_time) {
                            nextRunTime.setMonth(nextRunTime.getMonth() + 1);
                            //nextRunTime.setDate(parseInt(registerServiceObject.day_number));

                        }

                    }
                }
                //if run on weekends is false
                if (registerServiceObject.run_on_weekends == 1) {

                    if (nextRunTime.getDay() == 6) {
                        nextRunTime.setMonth(nextRunTime.getMonth() + 1);
                    } else if (nextRunTime.getDay() == 0) {
                        nextRunTime.setMonth(nextRunTime.getMonth() + 1);
                    }
                }
            }
            console.log("Next Run Time: " + nextRunTime);
            logger.info("Next Run Time: " + nextRunTime);
            return nextRunTime;
        } catch (error) {
            console.log("Error in creating Next Run Time: " + nextRunTime + " FileName: " + __filename);
            logger.info("Error in creating Next Run Time: " + nextRunTime + " FileName: " + __filename);
        }


    }

    runOnWeekends(nextRunTime, isRunOnWeeknds) {
        //isRunOnWeeknds 0-yes, 1-No
        nextRunTime = new Date(nextRunTime);
        if (isRunOnWeeknds == 1) {
            if (nextRunTime.getDay() == 6) {
                nextRunTime.setDate(nextRunTime.getDate() + 2);
            } else if (nextRunTime.getDay() == 0) {
                nextRunTime.setDate(nextRunTime.getDate() + 1);
            }
        }

        return nextRunTime;

    }

    getJobDetails(requestObject) {

        let nextRunTime = this.createNextRunTime(requestObject);
        if (requestObject.end_date_time != null) {
            if (nextRunTime > requestObject.end_date_time) {
                //make job diable if nextRunTime is greater than the end date time
                requestObject.status = this.DISABLED;
            }
        }
        let startTime = new Date(requestObject.start_date_time);
        //nextRun = new Date(nextRunTime);
        let jobDetails = new jobObject();
        jobDetails.job_name = requestObject.job_name;
        jobDetails.description = requestObject.description;
        jobDetails.scheduler_type = requestObject.scheduler_type;
        jobDetails.run_on_weekends = requestObject.run_on_weekends;
        jobDetails.start_date_time = startTime;
        jobDetails.end_date_time = requestObject.end_date_time;
        jobDetails.start_time = requestObject.start_time;
        jobDetails.end_time = requestObject.end_time;
        jobDetails.day_number = requestObject.day_number;
        jobDetails.time_of_day = requestObject.time_of_day;
        jobDetails.repeat_interval = requestObject.repeat_interval;
        jobDetails.times_triggered = 0;
        jobDetails.job_api = requestObject.job_api;
        jobDetails.mail_to = requestObject.mail_to;
        jobDetails.log_level = null;
        jobDetails.successful_last_run_time = null;
        jobDetails.last_run_status = this.LAST_RUN_STATUS_NOT_RUN;
        jobDetails.succesful_run_time = null;
        jobDetails.next_run_time = nextRunTime;
        jobDetails.status = requestObject.status;
        jobDetails.created_date = new Date();
        jobDetails.updated_date = new Date();
        jobDetails.created_by = 127434;
        jobDetails.updated_by = 127434;

        return jobDetails;

    }

    getJobDetailsForUpdate(jobDetailsfromDB, jobDetailsToUpdate) {
        let nextRunTime = this.createNextRunTime(jobDetailsToUpdate);
        let jobDetailsfromDBUpdate =  jobDetailsfromDB[0];
        try{
               
                let startDateTime = new Date(jobDetailsToUpdate.start_date_time);
                let endDateTime
                if(jobDetailsToUpdate.end_date_time == null){
                     endDateTime = new Date(this.DEFAULT_END_TIME);
                }else{
                     endDateTime = new Date(jobDetailsToUpdate.end_date_time);
                }
                
                //nextRun = new Date(nextRunTime);
                //let jobDetails = new jobObject();
                jobDetailsfromDBUpdate.job_name = jobDetailsToUpdate.job_name;
                jobDetailsfromDBUpdate.description = jobDetailsToUpdate.description;
                jobDetailsfromDBUpdate.run_on_weekends = jobDetailsToUpdate.run_on_weekends;
                
                jobDetailsfromDBUpdate.start_date_time = startDateTime;
                jobDetailsfromDBUpdate.end_date_time = endDateTime;
                jobDetailsfromDBUpdate.start_time = jobDetailsToUpdate.start_time;
                jobDetailsfromDBUpdate.end_time = jobDetailsToUpdate.end_time;
                jobDetailsfromDB.next_run_time = nextRunTime;
                //jobDetailsfromDB.day_number = null;
                //jobDetailsfromDB.time_of_day = requestObject.time_of_day;
                jobDetailsfromDBUpdate.repeat_interval = jobDetailsToUpdate.repeat_interval;
                jobDetailsfromDBUpdate.status = parseInt(jobDetailsToUpdate.status);
                //jobDetails.times_triggered = 0;
                //jobDetailsfromDB.job_api = "";
                //jobDetails.mail_to = "abhinav.singh@kpit.com";
                //jobDetails.log_level = null;
                //jobDetails.successful_last_run_time = null;
                //jobDetails.last_run_status = this.LAST_RUN_STATUS_NOT_RUN;
                //jobDetails.succesful_run_time = null;

                //jobDetailsfromDBUpdate.created_date = jobDetailsfromDB.created_date;
                jobDetailsfromDBUpdate.updated_date = new Date();
                //jobDetailsfromDBUpdate.created_by = jobDetailsfromDB.created_by;
                jobDetailsfromDBUpdate.updated_by = jobDetailsToUpdate.updated_by;
    
            }catch(error){
                logger.info("error in getJobDetailsForUpdate "+error);
            }
            return jobDetailsfromDBUpdate;
        
            }

    convertDateFormat(date) {
        let dateTimeInFormat;
        if(date != null){
        let dateTime = new Date(date);
        dateTimeInFormat = dateFormat(dateTime, config.dateFormat.dateTimeFormat);
        
        console.log("Date Time After Format change: " + dateTimeInFormat);
        if(dateTimeInFormat.includes("1970") || dateTimeInFormat.includes("3018") ){
            dateTimeInFormat = this.BLANK_STRING;
        }
    }else{
        dateTimeInFormat = this.BLANK_STRING;
    }
        return dateTimeInFormat
    }

    consvertJobLastRunStatus(lastRunStatus){
        if(lastRunStatus == this.LAST_RUN_STATUS_SUCCESS){
            lastRunStatus = this.LAST_RUN_STATUS_SUCCESS_VALUE;
        }else if(lastRunStatus == this.LAST_RUN_STATUS_FAIL){
            lastRunStatus = this.LAST_RUN_STATUS_FAIL_VALUE;
    }else{
        lastRunStatus = this.LAST_RUN_STATUS_NOT_RUN_VALUE;
    }

    return lastRunStatus;
}

    convertJobStatusInResponse(jobStatus) {
        if (jobStatus == this.ENABLED) {
            jobStatus = this.ENABLED_VALUE;
        } else if (jobStatus == this.DISABLED) {
            jobStatus = this.DISABLED_VALUE;
        }

        return jobStatus;
    }

    convertJobHistoryRunStatusInResponseFormat(jobHisotryRunStatus) {
        if (jobHisotryRunStatus == this.JOB_HISTORY_STATUS_SUCCESS) {
            jobHisotryRunStatus = this.JOB_HISTORY_STATUS_SUCCESS_VALUE;
        } else if (jobHisotryRunStatus == this.JOB_HISTORY_STATUS_FAIL) {
            jobHisotryRunStatus = this.JOB_HISTORY_STATUS_FAIL_VALUE;
        }else if (jobHisotryRunStatus == this.JOB_HISTORY_STATUS_RUNNING) {
            jobHisotryRunStatus = this.JOB_HISTORY_STATUS_RUNNING_VALUE;
        }

        return jobHisotryRunStatus;
    }

    convertSchedulerTypeInResponseFromat(schedulerType) {
        if (schedulerType == this.MORE_THAN_ONCE_A_DAY) {
            schedulerType = this.MORE_THAN_ONCE_A_DAY_VALUE
        } else if (schedulerType == this.DAILY) {
            schedulerType = this.DAILY_VALUE
        } else if (schedulerType == this.WEEKLY) {
            schedulerType = this.WEEKLY_VALUE
        } else if (schedulerType == this.MONTHLY) {
            schedulerType = this.MONTHLY_VALUE
        } else {
            schedulerType = this.RUN_JOB_RUN_ON_DEMAND_VALUE;
        }

        return schedulerType
    }

    convertStartDateInSearchCriteriaForm(date){//2018-04-24 00:00:00
        let convertedDate = new Date(date);
        convertedDate.setHours(0);
        convertedDate.setMinutes(0);
        convertedDate = dateFormat(convertedDate,'yyyy-mm-dd HH:MM:ss');
        return convertedDate
    }

    convertEndDateInSearchCriteriaForm(date){//2018-04-24 00:00:00
        let convertedDate = new Date(date);
        convertedDate.setHours(23);
        convertedDate.setMinutes(59);
        convertedDate = dateFormat(convertedDate,'yyyy-mm-dd HH:MM:ss');
       
        return convertedDate
    }


    //get Job history
    getJobHistory(jobObject) {
        let jobHistoryObject = new jobObjectVO();

        jobHistoryObject.job_id = jobObject.id;
        jobHistoryObject.run_date_time = new Date();
        //        jobHistoryObject.run_status = jobObject.last_run_status;
        jobHistoryObject.user_id = jobObject.updated_by;
        jobHistoryObject.job_data = "Test Data";
        jobHistoryObject.time_spent = 0;
        jobHistoryObject.created_date = jobObject.created_date;
        jobHistoryObject.updated_date = new Date();
        jobHistoryObject.created_by = jobObject.created_by;
        if(jobObject.isRunOnDemand){
            jobHistoryObject.updated_by = this.RUN_BY_SYSTEM ;
        }else{
            jobHistoryObject.updated_by = jobObject.updated_by;
        }
        

        return jobHistoryObject;
    };

    async runTask(jobObjectData) {
        logger.info("Entry into runTask() JOB DATA: " + JSON.stringify(jobObjectData));
        console.log("Entry into runTask() JOB DATA: " + JSON.stringify(jobObjectData));

        var updateJobHistoryRunStatus;
        var serviceUrl = jobObjectData.job_api;
        let jobDetailsToUpdate = new jobObjectVO();//This update will be push into database after execution
        jobDetailsToUpdate = jobObjectData;
        let updateJobHistory = new jobHistoryVO();
        jobDetailsToUpdate.job_api = serviceUrl;
        jobDetailsToUpdate.times_triggered = jobDetailsToUpdate.times_triggered + 1;

        //create history before running
        updateJobHistory = new Utility().getJobHistory(jobDetailsToUpdate);
        //updateJobHistory.time_spent = timeTakenByTask;
        updateJobHistory.run_status = new Utility().JOB_HISTORY_STATUS_RUNNING;
        updateJobHistoryRunStatus = updateJobHistory.run_status;
        //updateJobHistory.time_spent = null;
        let createJobHistoryResult = await new RegisterDao().createJobHistory(updateJobHistory);
        try {
            let startTaskTime = new Date();
            let executedTaskResponse = await new Promise((resolve, reject) => {
                //timout in milliseconds
                let requestTimeout = config.serviceRequest.requestTimeout;
                request(serviceUrl, { timeout: parseInt(requestTimeout) }, function (error, response, body) {
                    console.log(error);

                    if (error) {
                        if (error.code === 'ESOCKETTIMEDOUT') {
                            resolve("TIMEOUT");
                        }else{
                            resolve("Error in service")
                        }
                    }
                    if (response) {
                        if (response.statusCode == 200) {
                            resolve("200")
                        } else {
                            resolve("Error in Service");
                        }
                    }
                });

            })


            if (executedTaskResponse == 200) {
                if(jobDetailsToUpdate.isRunOnDemand){
                    jobDetailsToUpdate.successful_last_run_time = new Date()    
                }else{
                    jobDetailsToUpdate.successful_last_run_time = jobDetailsToUpdate.next_run_time;
                }
                
                updateJobHistory.run_status = new Utility().JOB_HISTORY_STATUS_SUCCESS;
                updateJobHistoryRunStatus = updateJobHistory.run_status;
                //jobDetailsToUpdate.last_run_time = jobDetailsToUpdate.next_run_time;//last time schduler run

                jobDetailsToUpdate.last_run_status = new Utility().LAST_RUN_STATUS_SUCCESS;
            } else {
                jobDetailsToUpdate.last_run_status = new Utility().LAST_RUN_STATUS_FAIL;
                updateJobHistory.run_status = new Utility().JOB_HISTORY_STATUS_FAIL;
                updateJobHistoryRunStatus = updateJobHistory.run_status;

                //send mail as job failed to execute
                let emailContent =await emailUtility.emailBody(jobDetailsToUpdate,"serviceFailed_template");
                emailUtility.sendEmail("abhinav.singh@kpit.com",jobDetailsToUpdate.mail_to,null,"Error in Service Execution",emailContent);

                
            }

            let endTaskTime = new Date();
            let timeTakenByTask = startTaskTime.getMilliseconds() - endTaskTime.getMilliseconds();
            jobDetailsToUpdate.last_run_time = new Date();
            if(!jobDetailsToUpdate.isRunOnDemand){
                jobDetailsToUpdate.next_run_time = new Utility().createNextRunTime(jobDetailsToUpdate);
            }
            
            jobDetailsToUpdate.updated_date = new Date;
            let updateResult = await new RegisterDao().updateJob(jobDetailsToUpdate);
            updateJobHistory = new Utility().getJobHistory(jobDetailsToUpdate);
            updateJobHistory.time_spent = Math.abs(timeTakenByTask);
            updateJobHistory.run_status = updateJobHistoryRunStatus;
            createJobHistoryResult = await new RegisterDao().updateJobHistory(updateJobHistory);

            logger.info("End OF runTask() JOB DATA: " + JSON.stringify(jobObjectData));
            console.log("End OF runTask() JOB DATA: " + JSON.stringify(jobObjectData));

            logger.info("End OF runTask() JOB DATA: " + JSON.stringify(updateJobHistory));
            console.log("End OF runTask() JOB DATA: " + JSON.stringify(updateJobHistory));

        } catch (error) {
            logger.info("Error: " + error);
            console.log(error);
        }
    }

}

module.exports = Utility