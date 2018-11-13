const userLoginModel = require('../models/UserLogin_model');
const users = require('../models/users_model');
const userLogin = require('../models/UserLogin_model')

function ArenaDao() {};

ArenaDao.prototype.getUserOnEmailID = (emailId) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = await userLoginModel.findAll({
                where: {
                    username: emailId
                }
            });
            resolve(result);
        } catch (error) {

            console.log("Error in Arena_Dao: ", error);
            reject(error);
        }
    })

}

ArenaDao.prototype.createUser = (userDetails) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = await users.create({
                name: userDetails.name,
                phone_number: userDetails.phoneNumber,
                email_id: userDetails.emailId,
                created_by: userDetails.emailId,
                updated_by: userDetails.email_id
            })
            resolve(result);
        } catch (error) {

            console.log("Error in Arena_Dao: ", error);
            reject(error);
        }
    })

}

ArenaDao.prototype.createentryInUserLogin = (userLoginDetails) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = await userLogin.create({
            user_id : userLoginDetails.user_id,
            username : userLoginDetails.username,
            password : userLoginDetails.password,
            created_by : userLoginDetails.username,
            updated_by : userLoginDetails.username
            })
            resolve(result);
        } catch (error) {

            console.log("Error in Arena_Dao: ", error);
            reject(error);
        }
    })

}

module.exports = ArenaDao;