const logger = require('../helpers/logger');

function LoggerHelper(){}

LoggerHelper.prototype.info = (method,message,requestID,fileName)=>{	
	let token = "method= "+method+", message= "+message+", requestID= "+requestID+", fileName= "+fileName;
	logger.info(token);
};

LoggerHelper.prototype.debug = (method,message,requestID,fileName,data)=>{	
	let token = "method= "+method+", message= "+message+", requestID= "+requestID+", fileName= "+fileName+", data= "+data;
	logger.debug(token);
};

LoggerHelper.prototype.error = (method,message,requestID,fileName,error)=>{
	let token = "method= "+method+", message= "+message+", requestID= "+requestID+", fileName= "+fileName+", error= "+error;
	logger.error(token);
};

module.exports = LoggerHelper;