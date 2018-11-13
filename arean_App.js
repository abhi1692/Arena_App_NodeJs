var app = require("express")();
let helmet = require("helmet");
var cors = require("cors");
let bodyParser = require("body-parser");
const logger = require('./helpers/logger');
const config = require("./config/config.json").serverConfig
var routes = require("./routes");
let models = require("./models");
//var schedule = require('node-schedule');
//var scheduleJobRoutes = require('./routes/schedule_job')

// register application level middlewares.
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

//register routes
routes.registerRoutes(app);

//register data models
//models.registerModels(app);


app.listen(config.port, function () {
  //console.log("Server is Running on : "+config.port);
  logger.info("Server is Running on : " + config.port);

});