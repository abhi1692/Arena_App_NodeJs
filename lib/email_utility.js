const logger = require("../helpers/logger");
var dateFormat = require('dateformat');
var config = require('../config/config.json');

//Below dependency will be used for sending emails
var nodemailer = require('nodemailer');

//Below dependency will be used to read files
var fs = require('fs');

//Below dependency will be used to locate file path easily
var path = require('path');

//mail config
const mailConfig = require("../config/config.json").mailConfig;


// Here we give the smtp details
var transporter = nodemailer.createTransport({
	host: mailConfig.host,
	port: mailConfig.port,
	auth: {
		user: mailConfig.auth.userName,
		pass: mailConfig.auth.passowrd
	}
}); //end of transporter

//This method is responsible to send email
var sendEmail = function (ffrom, too, ccc, ssubject, emailContent) {
	try{
	logger.info(sendEmail, "Entry Into sendEmail");
	logger.info("From: " + ffrom + " To: " + too + " cc: " + ccc + " Subject: " + ssubject + " Email Content: " + emailContent)
	var mailOptions = {
		from: ffrom, // sender address
		to: too, // list of receivers should be separated by comma
		cc: ccc,
		subject: ssubject, // Subject line
		text: '', // plain text body
		html: emailContent // html body
	};
	var currentTime = new Date();

	// send mail with defined transport object
	transporter.sendMail(mailOptions, async function (error, response) {

		if (error) {
			logger.error("Error in sendEmail: " + error);
		}else{
			logger.info("Successfully email sent.")		
			console.log("Successfully email sent.")		
			
		}
	});
	logger.info("Exit Into sendEmail")
}catch(err){
	logger.info("Error in  sendEmail: "+err);
	console.log("Error in  sendEmail: "+err);
}
} //end of sendServerRestartedNotificationEmail function


//this method is responsible for conetent in the email
var emailBody = function (mailDetailObject, fileTemplateName) {

	try{
	logger.info("Entry Into emailBody");
	console.log("Entry Into emailBody");
	var currentTime = new Date();

	fileName = fileTemplateName;
	var email_template_path = path.join(__dirname, '..', 'resources', 'email_templates', fileName + '.txt');
	var emailContent = fs.readFileSync(email_template_path, "utf8");

	let jobName = mailDetailObject.job_name;
	let jobRunTime = dateFormat(mailDetailObject.next_run_time, config.dateFormat.dateTimeFormat);

	var emailContentAfterReplace = emailContent.replace('JOB_NAME', jobName);
	emailContentAfterReplace = emailContentAfterReplace.replace('JOB_RUN_TIME', jobRunTime);

	logger.info("==================Inside emailContentAfterReplace=================");
	console.log("==================Inside emailContentAfterReplace=================");

	logger.info(emailContentAfterReplace);
	logger.info("==================End emailContentAfterReplace=================");
	console.log("==================End emailContentAfterReplace=================");
	logger.info(emailContentAfterReplace, "Exit from emailBody")
	console.log(emailContentAfterReplace, "Exit from emailBody")
	return emailContentAfterReplace;
	}catch(error){
		logger.info("Error in email body: "+error);
		console.log("Error in email body: "+error);
	}
	

}


module.exports = {

	emailBody: emailBody,
	sendEmail: sendEmail


}