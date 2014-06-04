var acceptLang = require('accept-language'),
	express = require('express'),
	app = express();

app.set('view engine', 'ejs');

app.use(function (req, res, next) {
	var parsed = acceptLang.parse(req.header('Accept-Language')),
		locale = parsed[0];

	res.locals.locale = locale.language + (locale.region ? '-' + locale.region : '');
	next();
});

app.use('/bower', express.static(__dirname + '/bower_components'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/partials', express.static(__dirname + '/public/partials'));

app.get('/', function (req, res) { res.render('index.ejs'); });

app.listen(3000);