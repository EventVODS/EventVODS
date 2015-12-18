var app       = require('express');
var router    = app.Router();
var auth      = require('../controllers/auth');
var Event     = require('../models/event');
var User      = require('../models/user');

// Sets up local user data for templating
router.all('/*', function(req, res, next) {
    // Dev logic, auto login user
    if (process.env.NODE_ENV === 'development') {
        if (!req.user) {
            console.log('No user detected, trying to authenticate');
            User.authenticate()('devAdmin', 'test', function(err, user, options) {
                if (err) console.log(err);
			    if (!user) {
				    console.log('ERROR: Set up dev admin account!');
			    } else {
				    req.login(user, function(err) {
                        if (err) console.log(err);
			            console.log('Dev login success!');
                        res.locals.user = user;
                        return next();
				    });
			    }
		    });
        } else {
            res.locals.user = req.user;
            return next();
        }
    } else {
        res.locals.user = req.user;
        return next();
    }
});

router.get('/', auth(0), function(req, res) {
    res.render('overview', {});
});

router.get('/dashboard', function(req, res) {
    res.render('overview', {});
});

router.get('/events', function(req, res) {
    res.render('events/events', {});
});

router.get('/events/new', function(req, res) {
    res.render('events/form', {});
});

router.get('/event/:id', function(req, res) {
	var event = {};
    res.render('events/event', {
		data: event,
	});
});

router.get('/event/:id/edit', function(req, res) {
    res.render('events/form', {
		eventID: req.params.id,
	});
});

router.get('/data', function(req, res) {
    res.render('data/overview', {});
});

router.get('/data/new', function(req, res) {
    res.render('data/form', {});
});

router.get('/data/casters', function(req, res) {
    res.render('data/casters', {});
});

router.get('/data/maps', function(req, res) {
    res.render('data/maps', {});
});

router.get('/data/teams', function(req, res) {
    res.render('data/teams', {});
});

router.get('/data/:id', function(req, res) {
    res.render('data/item', {});
});

router.get('/data/:id/edit', function(req, res) {
    res.render('data/form', {});
});

router.get('/profile', function(req, res) {
    res.render('user/profile', {});
});

router.get('/users', function(req, res) {
    res.render('user/users', {});
});

module.exports = router;
