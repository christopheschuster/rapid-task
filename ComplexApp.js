/*

Filename: ComplexApp.js

Description: This code demonstrates a complex JavaScript application that manages a digital store. 
The application implements various functionalities such as user authentication, product management, shopping cart, and order processing.

*/

// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

// Configure app
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// Database connections and models
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/digital_store');
var User = require('./models/user');
var Product = require('./models/product');
var Order = require('./models/order');

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        User.findById(req.session.userId, function(err, user) {
            if (user) {
                req.user = user;
                next();
            } else {
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/login');
    }
}

// Routes
app.get('/', isAuthenticated, function(req, res) {
    res.render('home', { user: req.user });
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    
    User.findOne({ email: email }, function(err, user) {
        if (user) {
            if (user.password === password) {
                req.session.userId = user._id;
                res.redirect('/');
            } else {
                res.render('login', { error: 'Invalid password' });
            }
        } else {
            res.render('login', { error: 'User not found' });
        }
    });
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/products', isAuthenticated, function(req, res) {
    Product.find({}, function(err, products) {
        if (err) {
            console.error(err);
            res.render('error');
        } else {
            res.render('products', { products: products });
        }
    });
});

app.get('/products/:id', isAuthenticated, function(req, res) {
    Product.findById(req.params.id, function(err, product) {
        if (err) {
            console.error(err);
            res.render('error');
        } else {
            res.render('product-details', { product: product });
        }
    });
});

app.post('/cart', isAuthenticated, function(req, res) {
    var productId = req.body.productId;
    Product.findById(productId, function(err, product) {
        if (err) {
            console.error(err);
            res.render('error');
        } else {
            req.user.cart.push(product);
            req.user.save();
            res.redirect('/');
        }
    });
});

app.get('/cart', isAuthenticated, function(req, res) {
    User.findById(req.user._id).populate('cart').exec(function(err, user) {
        if (err) {
            console.error(err);
            res.render('error');
        } else {
            res.render('cart', { cart: user.cart });
        }
    });
});

app.post('/orders', isAuthenticated, function(req, res) {
    var order = new Order({
        user: req.user,
        items: req.user.cart
    });

    order.save(function(err) {
        if (err) {
            console.error(err);
            res.render('error');
        } else {
            req.user.cart = [];
            req.user.save();
            res.redirect('/orders');
        }
    });
});

app.get('/orders', isAuthenticated, function(req, res) {
    Order.find({ user: req.user }, function(err, orders) {
        if (err) {
            console.error(err);
            res.render('error');
        } else {
            res.render('orders', { orders: orders });
        }
    });
});

// Start server
app.listen(3000, function() {
    console.log('Server is running on port 3000');
});