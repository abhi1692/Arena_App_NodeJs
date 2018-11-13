const winston = require("winston");
require("winston-daily-rotate-file");
var logConfig = require("../config/config.json").logConfig;

var transport = new (winston.transports.DailyRotateFile)({
	filename: logConfig.logFileName,
	datePattern: "yyyy-MM-dd.",
	prepend: true,
	level:logConfig.logLevel
});

var logger = new (winston.Logger)({
	transports: [
        
      new (winston.transports.Console)(),
		transport
	]
});
module.exports = logger;



