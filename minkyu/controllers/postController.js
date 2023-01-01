const postService = require('../services/postService');

const createUserPost = async(req, res) => {
    try{
        await postService.createUserPost(req);
        return res.status(201).json({ meesage : "postCreated"});
    }catch{
        console.error(err);
        return res
            .status(err.statusCode || 500)
            .json({ message : err.message });
    }
};

const modifyUserPost = async(req, res) => {
    try{
        await postService.createUserPost(req);
        return 
    }
}