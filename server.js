 // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var msg91=require('msg91-sms'); // for messaging
    var fs = require('fs');
    var path = require('path');
    var uploadDir = path.join(__dirname, 'export'); //export files
    // configuration =================

    mongoose.connect('mongodb://localhost/test');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                   // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());


    // define model =================
    var Todo = mongoose.model('Todo', {
        name: String,
        fatherName: String,
        nomineeName: String,
        depositAmount: Number,
        depositDate: Date,
        maturityAmount: Number,
        maturityDate: Date
    });

    var Loan = mongoose.model('Loan', {
        name: String,
        fatherName: String,
        suretyName: String,
        depositAmount: Number,
        LoanAmount: Number,
        LoanDate:Date,
        PhoneNumber:Number,
        personId : String
    });

    var authkey='166688Aehtm9hv55975883c';



    // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {
        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
                res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            name: req.body.name,
            fatherName: req.body.fatherName,
            nomineeName: req.body.nomineeName,
            depositAmount: req.body.depositAmount,
            depositDate: req.body.depositDate,
            maturityAmount: req.body.maturityAmount,
            maturityDate: req.body.maturityDate,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        res.sendfile('./public/pages/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    app.get('/writeFileTodo', function(req, res) {
        var jsonFile = uploadDir + '/todos.json';
        console.log(jsonFile);
        Todo.find(function(err, todos) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err){
                res.send(err);
            }else{
                console.log(todos);
            // write all the todo objects to a file.
                fs.writeFile(jsonFile, JSON.stringify(todos), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("JSON saved to " + jsonFile);
                        res.send("JSON saved to " + jsonFile);
                    }
                });
            }       
        });
    });


    app.post('/api/takeLoan',function(req,res){
        var PhoneNumber = req.body.PhoneNumber;
        Loan.create({
            name: req.body.name,
            fatherName: req.body.fatherName,
            suretyName: req.body.suretyName,
            depositAmount: req.body.depositAmount,
            LoanAmount: req.body.LoanAmount,
            LoanDate: req.body.LoanDate,
            PhoneNumber: req.body.PhoneNumber,
            personId: req.body.personId,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // send alert Message to the number

            var number = PhoneNumber;
            var message ='Testing API'; // need to change accordingly
            var senderid ='VandyC'; // can set using msg91 api
            var route ='4'; // for transactional route
            var dialcode ='91'; // for india
            msg91.sendOne(authkey,number,message,senderid,route,dialcode,function(response){
            //Returns Message ID, If Sent Successfully or the appropriate Error Message 
                console.log(response);
            });
        });
    });
    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");

