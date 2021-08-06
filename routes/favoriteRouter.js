const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('dishes._id')
    .populate('user')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite == null){
            console.log(req.body);
            Favorites.create({user: req.user._id})
            .then((favorite) => {
                for (var i = (req.body.length -1); i >= 0; i--) {
                    favorite.dishes.push(req.body[i]);
                }

                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('dishes._id')
                    .populate('user')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite); 
                    })                               
                }, (err) => next(err));
            }, (err) => next(err)) 
            .catch((err) => next(err));
        } else{
            for (var i = (req.body.length -1); i >= 0; i--) {
                favorite.dishes.push(req.body[i]);
            }

            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('dishes._id')
                .populate('user')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite); 
                })       
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+ req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite == null){
            Favorites.create({user: req.user._id})
            .then((favorite) => {
                favorite.dishes.push({"_id" : req.params.dishId});
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('dishes._id')
                    .populate('user')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite); 
                    })                               
                }, (err) => next(err));
            }, (err) => next(err)) 
            .catch((err) => next(err));
        } else{
            favorite.dishes.push({"_id" : req.params.dishId});
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('dishes._id')
                .populate('user')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite); 
                })       
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite != null) {
          const tempDishes = favorite.dishes;
          favorite.dishes = [];
          tempDishes.map((dish) => {
            if (dish._id != req.params.dishId) {
              favorite.dishes.push(dish);
            }
          });
          favorite.save().then(
            (favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            },
            (err) => next(err)
          );
        } else {
          res.statusCode = 404;
          res.end("There are no dishes to delete");
        }
      })
      .catch((err) => next(err));
});

module.exports = favoriteRouter;