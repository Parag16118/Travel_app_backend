const express = require('express');
const mongoose = require('mongoose');
const cors = require('./cors');

const Places = require('../models/places');

const places = express.Router();


places.use(express.json());


places.route('/')
.options(cors.corsWithOptions,async (req, res) => { res.sendStatus(200); })
.options(cors.cors,(req, res) => { res.sendStatus(200); })
.get((req,res,next) => {
    Places.find({})
    .then((places) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(places);
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = places;