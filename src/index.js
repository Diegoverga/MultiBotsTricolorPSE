const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const favicon = require('serve-favicon');


//settings
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
app.use(express.static(path.join(__dirname, 'public')));


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(session({
    secret:'Salchipapa',
    resave: false,
    saveUninitialized: false
}));

//routes

// Varials Flash
app.use(flash());
app.use((req, res, next)=>{
    app.locals.imgCapcha = req.flash('imgCapcha');
    app.locals.bot = req.flash('bot');
    next();
});

app.use('/bot', require('./routes/pupe'));
app.get('/', (req, res) => {
    
    res.sendFile(__dirname + 'index.html');
});

app.use(favicon(path.join(__dirname, 'public/img/icons', 'favicon.ico')));
//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port ' + app.get('port'));
});
