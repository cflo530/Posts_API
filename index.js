const express = require('express');
const app = express();
const posts = require('./posts.json');
const fs = require('fs');
const { isRegExp } = require('util');

app.use(express.json());
app.use(express.urlencoded());

// Practice GET Route to test Port
//app.get('/', (req, res) => {
 //   res.send('Hello!');
//});

// GET Route to fetch all Posts
app.get('/posts', (req, res) => {
    return res.json({posts});
});

// GET Route to fetch single Post
app.get('/posts/:id', (req, res) =>{
    let id = req.params.id;
    let foundPost = posts.find((post) => {
        return String(post.id) === id;
    });
    if(foundPost){
        return res.status(200).json({post: foundPost});
    }
    else{
        return res.status(404).json({message: "Post not found."});
    }
});

// Post Route to create new Post
app.post('/posts', (req, res) => {
    console.log(req.body.newPost);
    posts.push(req.body.newPost);
    let data = JSON.stringify(posts, null, 2);
    fs.writeFile('posts.json', data, (err) => {
        if(err){
            return res.status(500).json({message: err});
        }
    });
    return res.status(200).json({message: "New post created."});
});

// Put Route to update single Post
app.put('/posts/:id', (req, res)  => {
    console.log(req.params.id);
    let id = req.params.id;
    let updatedPost = req.body.updatedPost;
    
    let updatePost = posts.find(post => String(post.id) === id);

    if(updatePost){
        updatePost.title = updatedPost.title;
        updatePost.body = updatedPost.body;

        let indexId = posts.indexOf(updatePost);
        posts[indexId] = updatePost;
        let StringedData = JSON.stringify(posts, null, 2);
        fs.writeFile('posts.json', StringedData, (err) => {
            if(err){
                return res.status(500).json({message: err});
            }
        });
        return res.status(200).json({posts:updatePost});
    }
    else{
        return res.status(404).json({message: "Post could not be updated."});
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});