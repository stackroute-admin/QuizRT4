//Copyright {2016} {NIIT Limited, Wipro Limited}
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.


var express = require('express'),
    app = express(),
    path = require('path'),
    http = require('http'),
    mongoose = require('mongoose'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    redis = require('redis'),
    redisClient = redis.createClient(),
    RedisStore = require("connect-redis")(session),
    server = http.createServer(app),
    bodyParser = require('body-parser'),
    topicsHandler = require('./routes/topicsHandler'),
    profileHandler = require('./routes/profileHandler'),
    tournamentHandler = require('./routes/tournamentHandler'),
    confTournamentHandler=require('./routes/confTounamentHandler'),
    index = require('./routes/index'),
    authenticationHandler = require('./routes/authenticationHandler')(passport),
    // redis_store = new RedisStore({ host: '172.23.238.253', port: 6379, client: redisClient}),
    redis_store = new RedisStore({ host: '127.0.0.1', port: 6379, client: redisClient}),
    Quiz = require("./models/quiz"),
    sessionMiddleware = session({
      store: redis_store,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 3600000
      },
      secret: 'keyboard cat'
    });
    mongoose.connect('mongodb://localhost/quizRT3');

//mongoose.connect('mongodb://quizart.stackroute.in/quizRT3');
 // mongoose.connect('mongodb://172.23.238.253/quizRT3');
//  }),
mongoose.connection.on('error', console.error.bind(console, 'Failed to establish connection to MongoDB@StackRouteHost:PORT/quizRT3'));
mongoose.connection.on('open', function() {
  console.log('Connected to MongoDB@StackRouteHost:PORT/quizRT3');
});
require('./routes/socket.js')(server,sessionMiddleware);
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
//app.set('views', './views');
//app.set('views', './views/createConfTournament.ejs');
app.use(express.static('./public'));
//register routers to route paths
app.use('/', index);
app.use('/auth',authenticationHandler);
var initPassport = require('./passport-init');
initPassport(passport);
//middleware to check if user session exists, and check for isAuthenticated cookie
app.use( function( req, res, next ) {
  if( req.cookies.isAuthenticated || (req.session && req.session.user) ) {
    next();
  } else{
    console.log('User is logged out. User session doesnot exist.');
    res.writeHead(401);
    res.end( JSON.stringify( { error: 'User session does not exist. Kindly do a fresh login.'} ));
  }
});

app.use('/userProfile', profileHandler);
app.use('/topicsHandler', topicsHandler);
app.use('/tournamentHandler', tournamentHandler);
app.use('/',confTournamentHandler);
// server.listen(8080, function() {
// server.listen(8080, function() {
var listener = server.listen(3000, function() {
  console.log('App started for Quiz Play!! Please use ur IP e.g 123.23.123.23:'+listener.address().port);
});
