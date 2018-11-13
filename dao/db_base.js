const Sequelize = require("sequelize");
var dbConfig = require("../config/config.json").dbConfig;
const logger = require("../helpers/logger");

//Provide retry connection option.
const reconnectOptions = {
	max_retries: dbConfig.reconnectOptions.maxRetries,
	onRetry: function (count) {
		logger.error("onRetry", "Connection lost to database, and trying to reconnect(" + count + ")", null, __filename);
	}
};


//Establish database connection
// const sequelize = new Sequelize('Test', 'sa', 'password@123', {
// 	host: 'localhost',
// 	dialect: 'mssql',
// 	pool: dbConfig.pool,
// 	retry: reconnectOptions || true,
// 	logging: false,
// 	port: dbConfig.port
// });

const sequelize = new Sequelize('Arena', 'sa', 'root', {
	server: 'DESKTOP-BQRG3KO\\SQLEXPRESS',
	port: '1433',
	dialect: "mssql",
	dialectOptions: {
		instanceName: "SQLEXPRESS"
	}

});



//Check for connection status.
sequelize.authenticate()
	.then(() => {
		logger.info("sequeslieze.authenticate", "Connection established successfully...", null, __filename);
	})
	.catch((error) => {
		logger.error("sequelize.authenticate", "Failed to establish connection", null, __filename, error);
		throw Error(error);
	});

module.exports.getManagedTransaction = function () {

	return new Promise((resolve) => {
		sequelize.transaction((transaction) => {
			resolve(transaction);
		});
	});
};

module.exports.sequelize = sequelize;