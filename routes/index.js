var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Font = mongoose.model('Font');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});

router.get('/fonts', function(req, res, next) {
	Font.find(function(err, fonts) {
		if(err){ return next(err); }

		res.json(fonts);
	});
});

router.post('/fonts', function(req, res, next) {
	var font = new Font(req.body);

	font.save(function(err, font) {
		if(err){ return next(err); }

		res.json(font);
	});
});

router.param('font', function(req, res, next, id) {
	var query = Font.findById(id);

	query.exec(function (err, font){
		if (err) { return next(err); }
		if (!font) { return next(new Error("can't find font")); }

		if(req.body) {
			for(var key in req.body) {
				font[key] = req.body[key];
			}
		}
		req.font = font;
		return next();
	});
});

router.get('/fonts/:font', function(req, res) {
	res.json(req.font);
});

router.put('/fonts/:font', function(req, res, next) {
	req.font.save(function(err, font) {
		if (err) { return next(err); }

		res.json(font);
	});
});

router.delete('/fonts/:font', function(req, res, next) {
	req.font.remove(function(err, font) {
		if (err) { return next(err); }

		res.json(font);
	});
});

module.exports = router;


