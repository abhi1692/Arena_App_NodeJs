const ArenaService = require("../services/arena_services");
const serverConfig = require("../config/config.json").serverConfig

module.exports = function (app) {
	// /api/v1/regiter
	// app.post(serverConfig.baseURL+serverConfig.version+"/regiterJob",new RegisetrService().createNewJobForMoreThanOnceADay);
	// app.post(serverConfig.baseURL+serverConfig.version+"/updateJob/:id",new RegisetrService().updateJobDetails);
	// app.get(serverConfig.baseURL+serverConfig.version+"/getAllJobs",new RegisetrService().getAllJobs);
	app.post("/api/validateUser", new ArenaService().validateUser);

	app.post("/api/registerUser", new ArenaService().registerUser);
};