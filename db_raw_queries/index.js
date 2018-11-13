

module.exports = {

	getAllHistory: function()  {
		let query = `select job.job_name,job.start_date_time,job.end_date_time, job.successful_last_run_time,job.status,job.last_run_status,
		job_history.time_spent,job_history.run_date_time,job_history.run_status,job_history.updated_by from job,job_history where job.id = job_history.job_id`;
		return query;
	},

	getAllHistoryOnCreatedDate: function(startDate, endDate){
		let query = `select job.job_name,job.start_date_time,job.end_date_time, job.successful_last_run_time,job.status,job.last_run_status,
		job_history.time_spent,job_history.run_date_time,job_history.run_status,job_history.updated_by,job_history.created_date
		from job_history 
		INNER JOIN job ON job.id = job_history.job_id 
		where job_history.created_date >= '${startDate}'  AND job_history.created_date <= '${endDate}'`

		return query

	},

	getAllJobs: function()  {
		let query = `SELECT *  from job`;
		
		return query;
	},

	getAllJobsExecutedToday:function(){
		let query = `SELECT job.job_name,job.start_date_time,job_history.time_spent,job.last_run_status,job_history.created_by FROM job_history
		INNER JOIN job on job.id = job_history.job_id
		 WHERE ( 
					(DAY(job_history.run_date_time) = DAY(GETDATE())) AND 
					(MONTH(job_history.run_date_time) = MONTH(GETDATE())) AND
					(YEAR(job_history.run_date_time) = YEAR(GETDATE())) AND
					job_history.run_status = 1
					)`;
			return query;
	},

	getAllRunningJobs:function(){
		let query = `select job.job_name,job.last_run_time,job.times_triggered,job.scheduler_type,job.start_date_time,job.end_date_time, job.successful_last_run_time,job.status,job.last_run_status,
		job_history.time_spent,job_history.run_date_time,job_history.run_status,job_history.updated_by from job,job_history
		where job.id = job_history.job_id AND job_history.run_status =2`;
		return query;
	}
	



};