const express = require("express");
const usersCtrl = require('./routes/usersCtrl');



exports.router = (function() {
    const apiRouter = express.Router();
    
    
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/one/:id').get(usersCtrl.getUserProfil);
    apiRouter.route('/users/one/:id').put(usersCtrl.updateUserProfile);
    apiRouter.route('/users/all/').get(usersCtrl.getUserProfilAll);
    apiRouter.route('/users/delete/:id').delete(usersCtrl.deleteUserProfile);
    return apiRouter;
})();



