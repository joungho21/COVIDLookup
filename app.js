const express = require("express"); 
const     app = express();
const bodyParser = require("body-parser");
const engine = require("ejs-mate");

// app.use(bodyParser.urlencoded({extended: true}));

app.engine('ejs', engine);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.get("/", (req, res) => {
    res.status(200).send("sever setup was successfully yaaaay!!!!!!");
});
//error handling 
app.use((err, req, res, next) => {
    //set locals only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err: {};

    //render error page
    res.status(err.status || 500);
    res.send('error', err.message);
}); 

module.exports = app;