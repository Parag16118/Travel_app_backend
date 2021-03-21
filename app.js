var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dotenv= require('dotenv') 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var placeRouter = require('./routes/places');
var findRouter = require('./routes/find-route');

dotenv.config();

var app = express();

var cors = require('cors')

app.use(cors()) 

const data=require('./data.json');
const Deals = require('./models/deals');
const Places = require('./models/places');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/places', placeRouter);
app.use('/find-route', findRouter);



const mongourl = `${process.env.MONGO_URL}`;

const convertDuration=(h,m)=>{
  let hh=parseInt(h);
  let mm=parseInt(m);
  let time=hh*60+mm;
  return time;
}

const all_places=(data)=>{
  let s=new Set();
  data.deals.forEach((item)=>{
    s.add(item.departure);
    s.add(item.arrival);
  })
  let a=Array.from(s).sort();
  
  return a;
}

const connect = mongoose.connect(mongourl);
connect.then((db) => {
    console.log("Connected correctly to server");

    var y=0;
    data.deals.forEach((item)=>{
      let x=item;
      x.duration=convertDuration(item.duration.h,item.duration.m);
      x.id=y;
      Deals.create(x);
      y+=1;
    })

    let s=all_places(data);
    y=0;
    s.forEach((item)=>{
      let x={id:y,name:item};
      Places.create(x);
      y++;
    })

}, (err) => { console.log(err); });





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
