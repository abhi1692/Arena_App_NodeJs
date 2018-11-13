const fs = require("fs");
const modelsFolder = __dirname;
const sequelize = require("../dao/db_base").sequelize;

function registerModels(){

	const routeFiles = fs.readdirSync(modelsFolder);

	//register models here.
	routeFiles.forEach(function(modelFile){
		if(modelFile.endsWith("_model.js")){			
			require("./"+modelFile);
		}
	});
	
}

module.exports.registerModels = registerModels;
