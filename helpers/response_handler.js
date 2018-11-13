

function ResponseHandler(){}

ResponseHandler.prototype.successHandler = (res, statusCode, data,requestID)=>{

	const responseObject = {
		statusCode:statusCode,
		success:true,
		data:data,
		requestID:requestID
	};
	res.status(statusCode).send(responseObject);

};

ResponseHandler.prototype.errorHandler = (res,error,requestID)=>{

	if(error && typeof error === "object" && error.statusCode ) {
		error.success = false;
		error.requestID = requestID;
		res.status(error.statusCode).send(error);
	}else{
		let responseObject = {
			statusCode:500,
			message:error,
			success:false,
			requestID:requestID
		};
		res.status(500).send(responseObject);
	}
    
};

module.exports = ResponseHandler;

