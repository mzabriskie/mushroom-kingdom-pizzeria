var acceptLang = require('accept-language'),
	express = require('express'),
	exphbs = require('express3-handlebars'),
	app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(function (req, res, next) {
	var parsed = acceptLang.parse(req.header('Accept-Language')),
		locale = parsed[0];

	res.locals.locale = locale.language + (locale.region ? '-' + locale.region : '');
	next();
});

app.get('/', function (req, res) { res.render('home'); });

app.listen(3000);