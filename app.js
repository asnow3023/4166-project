// require modules
const express = require('express');
const morgan = require('morgan');
const itemRoutes = require('./routes/itemRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
const uri = "mongodb+srv://jlee322:snowdotcom1@cluster0.38x3d1j.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
.then(() => {
    // start the server
    app.listen(port, host, () => {
        console.log('Server is running on port ', port)
});
})
.catch(err=>console.log(err.message));

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// setup routes
app.get('/', (req, res) => {
    res.render('index', { cssFile: '/styles/index.css' });
});

app.use('/items', itemRoutes);

// error 404 middleware
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err); // passes the error to the next middleware / error handler
});

// error handling middleware
app.use((err, req, res, next) => {
    //if no status has been set by previous middlewares
    if(!err.status){
        err.status = 500;
        err.message = ("Internal server error");
    }

    //if error has been passed down from the previous middelwares
    res.status(err.status);
    console.log(err);
    res.render('error', {error: err, cssFile: '/styles/default.css'})
});