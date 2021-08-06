const express = require('express');;
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
//make public files avaiable to use
app.use(express.static("public"));

//DB Connection
mongoose.connect("mongodb://localhost:27017/blog", {useNewUrlParser: true, useUnifiedTopology: true});

const articlesSchema = {
    title: String,
    content: String
}

const pagesSchema = {
    title: String,
    content: String
}

//Using to avoid warning
mongoose.set('useFindAndModify', false);

//will create a table with articles and pages
const Article = mongoose.model('Article', articlesSchema);

const Page = mongoose.model('Page', pagesSchema);

app.get('/', (req, res) => {
    //Show articles
    Article.find({}, (err, articles) => {
        res.render("home", {
            myArticles: articles
        });
    });
});

app.get('/page/:pageName', (req, res) => {
    pageName = _.lowerCase(req.params.pageName);
    console.log(pageName);
    Page.findOne({title: pageName}, (err, page) => {
        if(page) {
            res.render("page", {
                title: _.upperCase(page.title),
                content: page.content
            });
        } else {
            res.render("page", {
                title: "404 Not Found",
                content: "OOPS The Page you are looking for is Not Found"
            });
        }
    });
});


//show individual article
app.get('/post/:postId', (req, res) => {
    let postId = req.params.postId;
    Article.findById(postId, (err, result) => {
        if (!err) {
            res.render("post", {
                title: result.title,
                content: result.content
            });
        } else {
            console.log(err);
        }

    });
});


app.get('/compose', (req, res) => {
    res.render('compose');
});

// Post Article
app.post('/compose', (req, res) => {

    let reqTitle = req.body.title;
    let reqContent = req.body.content;

    const article = new Article({
        title: reqTitle,
        content: reqContent
    });
    article.save();
    res.redirect('/');
});




app.listen(3000, () => {
    console.log('Server started at port 3000');
})