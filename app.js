var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect(process.env.DATABASEURL);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: "String",
    image: "String",
    date: {type: Date, default: Date.now()},
    body: "String"
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({title: "Granite Creek", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg", body:"On the hills, the best in the hill"}, function(err, addedCamp){
//     if (err){
//         console.log(err);
//     }else{
//         console.log("Added: " + addedCamp);
//     }
//  });   


//ROOT
app.get("/", function (req, res){
    res.redirect("/blogs");
});

//Index route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, allBlogs){
        
        if(err){
            console.log(err);
        }else{
            res.render("index", { blog: allBlogs });
        }
    });    
});

//new route
app.get("/blogs/new", function(req, res){
    
    res.render("new");
    
});

//Create route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var formData = req.body.blog;
  Blog.create(formData, function(err, newBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
        
    });
    
});

//Show route

app.get("/blogs/:id", function(req, res){
    
    Blog.findById(req.params.id, function(err, blogEntry){
        if(err){
            console.log(err);
        }else{
            res.render("show", {blog:blogEntry});
        }
        
    });
});

//Edit route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, blogPost){
        if(err){
            console.log(err);
        }else{
            res.render("edit", { blog: blogPost });
        }
    });
    
});

//Update
app.put("/blogs/:id", function(req, res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var formData = req.body.blog;
    Blog.findByIdAndUpdate(req.params.id, formData, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
    
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});