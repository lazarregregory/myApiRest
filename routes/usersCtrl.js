const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const models = require('../models');
const asyncLib = require('async')
module.exports = {

    register: (req, res) => {

        // Params
        let email = req.body.email;
        let nom = req.body.nom;
        let prenom = req.body.prenom;
        let password = req.body.password;

        if (email == null || nom == null || prenom == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters'});
        }

        models.Users.findOne({
            attributes: ['email'],
            where: { email: email}
        })
        .then(function(userFound) {
            if(!userFound) {
                let newUser = models.Users.create({
                    email: email,
                    nom: nom,
                    prenom: prenom,
                    password: password,
                    role: 0
                })
                .then(function(newUser) {
                    return res.status(201).json({
                        'userId': newUser.id,
                        'message': 'User successfully created'

                    })
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'cannot add user'});
                });
            }else {
                return res.status(409).json({ 'error': 'user already exist'});  
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user'});
        })   
    },
    getUserProfil: function(req, res) {

        models.Users.findOne({
            attributes: ['id', 'email', 'nom', 'prenom','password'],
            where: { id: req.params.id }
        }).then(function(user) {
            if (user) {
                res.status(201).json(user);
            }else {
                res.status(404).json({ 'error': 'user not found'});
            }
        }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
    },
    getUserProfilAll: function(req, res) {

        models.Users.findAll({
            attributes: ['id', 'email', 'nom', 'prenom','password'],
            
        }).then(function(user) {
            if (user) {
                res.status(201).json(user);
            }else {
                res.status(404).json({ 'error': 'user not found'});
            }
        }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
    },
    updateUserProfile: function(req, res) {
        // PARAMS
        let email = req.body.email;
        let nom = req.body.nom;
        let prenom = req.body.prenom;
        let password = req.body.password;

        asyncLib.waterfall([
            function(done) {
                models.Users.findOne({
                    attributes: ['id', 'email', 'nom', 'prenom','password'],
                    where: { id: req.params.id }
                }).then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
            function(userFound, done) {
                if(userFound) {
                    userFound.update({
                        email: (email ? email : userFound.email),
                        nom: (nom ? nom : userFound.nom),
                        prenom: (prenom ? prenom : userFound.prenom),
                        password: (password ? password : userFound.password)
                    }).then(function() {
                        done(userFound);
                    }).catch(function(err) {
                        res.status(500).json({ 'error': 'cannot update user'});
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },

        ], function(userFound) {
            if (userFound) {
                return res.status(200).json({userFound, 'message': 'User successfully modified'});
            } else {
                return res.status(500).json({ 'error': 'cannot update user profile'});
            }
        });
    },
    deleteUserProfile: function(req, res) {
      
          asyncLib.waterfall([
            function(done) {
                models.Users.findOne({
                    where: { id: req.params.id }
                })
                .then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
            function(userFound, done) {
                if(userFound) {
                    userFound.destroy({   
                    })
                    .then(function(userFound) {
                        done(null, userFound);
                    })
                    .catch(function(err) {
                        res.status(500).json({ 'error': 'unable to destroy user'});
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },

        ], function(userFound) {
            if (!userFound) {
                return res.status(200).json({'message': 'user successfully deleted'});
            } else {
                return res.status(500).json({ 'error': 'cannot delete user profile'});
            }
        });
    }
}
