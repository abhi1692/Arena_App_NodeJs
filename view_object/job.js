class Job{
    constructor(){
        this.job_name;
        this.description;
        this.scheduler_type;
        this.run_on_weekends;
        this.start_date_time;
        this.end_date_time;
        this.start_time;
        this.end_time;
        this.day_number;
        this.time_of_day;
        this.repeat_interval;
        this.times_triggered;
        this.job_api;
        this.mail_to;
        this.log_level;
        this.successful_last_run_time;
        this.last_run_status;
        this.last_run_time;
        this.next_run_time;
        this.status;
        this.created_date
        this.updated_date;
        this.created_by;
        this.updated_by;
    }
   
}

module.exports = Job;