const ResponseHandler = require("../helpers/response_handler");
const ArenaDao = require('../dao/arean_dao');
const Constants = require('../lib/constants')

function ArenaService() {}

ArenaService.prototype.validateUser = async (req, res) => {
    try {
        let userName = req.body.userName;
        let userPassword = req.body.password;
        let result = await new ArenaDao().getUserOnEmailID(userName);
        if (result) {
            if (result.length > 0) {
                if (result[0].pd_password === userPassword) {
                    res.send({
                        message: Constants.userAuthenticationSuccess
                    });
                } else {
                    res.send({
                        message: Constants.userAuthenticationFail
                    });
                }
            } else {
                res.send({
                    message: Constants.noUserFound
                });
            }
        }

        res.send({
            message: Constants.unesxpectedError
        });
    } catch (error) {

    }
}

ArenaService.prototype.registerUser = async (req, res) => {
    try {
        let userDetails = req.body;
        let result = await new ArenaDao().createUser(userDetails);
        // let userLoginObject = {
        //     user_id: result.id,
        //     username: result.email_id,
        //     password: userDetails.password,
        //     created_by: result.email_id,
        //     updated_by: result.email_id
        // }

        // let loginUserResuly = await new ArenaDao().createentryInUserLogin(userLoginObject);

        res.send({
            message: Constants.userRegisterSuccessFully
        });
    } catch (error) {
        console.log(error);
        if (error.name === "SequelizeUniqueConstraintError") {
            res.send({
                message: Constants.emailMustBeUnique
            });
        } else {
            res.send({
                message: "Something wrong with database"
            });
        }
    }
}
module.exports = ArenaService;