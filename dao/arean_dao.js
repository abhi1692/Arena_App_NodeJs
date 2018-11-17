const palyerDetails = require('../models/PlayerDetails_model');

function ArenaDao() {};

ArenaDao.prototype.getUserOnEmailID = (emailId) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = await palyerDetails.findAll({
                where: {
                    pd_user_name: emailId
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

            let result = await palyerDetails.create({
                pd_name: userDetails.name,
                pd_mobile_no: userDetails.phoneNumber,
                pd_email_id: userDetails.emailId,
                pd_user_name: userDetails.emailId,
                pd_password: userDetails.password,
                // pd_created_on: new Date()
            })
            resolve(result);
        } catch (error) {

            console.log("Error in Arena_Dao createUser(): ", error);
            reject(error);
        }
    })

}

ArenaDao.prototype.createentryInUserLogin = (userLoginDetails) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = await userLogin.create({
                user_id: userLoginDetails.user_id,
                username: userLoginDetails.username,
                password: userLoginDetails.password,
                created_by: userLoginDetails.username,
                updated_by: userLoginDetails.username
            })
            resolve(result);
        } catch (error) {

            console.log("Error in Arena_Dao: ", error);
            reject(error);
        }
    })

}

module.exports = ArenaDao;