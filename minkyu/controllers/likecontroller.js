const likeService = require("../services/likeService");

const postLike = async(req, res) => {
    try{
        const check = await likeService.postlike(req);
        if(check === "create"){
            return res.status(201).json({ message : "likeCreated" });
        }else{
            return res.status(200).json({ message : "likeDeleted" });
        }
    } catch (err){
        res.status(err.statusCode || 500).json({ message : err.message });
    }
};

module.exports = { postLike }; 