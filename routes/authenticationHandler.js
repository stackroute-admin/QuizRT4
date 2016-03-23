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
//
//   Name of Developers  Raghav Goel, Kshitij Jain, Lakshay Bansal, Ayush Jain, Saurabh Gupta, Akshay Meher
//

var express = require('express'),
  router = express.Router();

module.exports = function(passport){
	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.send({error:null});
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.send({ error: "Invalid username or password"});
		// req.session.user=null;
	});
  router.get('/success-register', function(req, res){
		res.send({state: 'success'});
	});
  router.get('/failure-register', function(req, res){
		res.send({state: 'failure'});
	});
	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/register', passport.authenticate('register', {
    successRedirect: '/auth/success-register',
    failureRedirect: '/auth/failure-register'
  }));

	//login using facebook
	router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

	router.get('/facebook/callback',
	passport.authenticate('facebook', { successRedirect: '/success',
																			failureRedirect: '/' }));
	//login using google
	router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

  router.get('/google/callback',
	passport.authenticate('google', { successRedirect: '/userProfile',
																			failureRedirect: '/' }));


	return router;

}
