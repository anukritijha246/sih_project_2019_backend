const Comment = require('../models/Comments');
const Post = require('../models/Post');
const Log = require('../models/log');
const User=require('../models/user');
//Simple version, without validation or sanitation
// exports.test = function (req, res) {
//     res.send('Greetings from the Test controller!');
// };

// exports.user_create = function (req, res) {
//     let user = new User(
//         {
//             name: req.body.name,
//             dept: req.body.dept,
//         }
//     );
//     user.save(function (err) {
//         if (err) {
//             return next(err);
//         }
//         res.send('User Created successfully')
//     })
// };
/*
exports.post_create = function (req, res) {
    let post = new Post(
        {
            title: req.body.title,
            content: req.body.content,
             username: req.body.username,
             upvote: req.body.upvote
        }
    );
    post.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('post Created successfully')
    })
};*/
exports.post_create = function (req, res) {
    let post = new Post(
        {
            title: req.body.title,
            content: req.body.content,
            username: req.body.username,
            companyid: req.body.companyid,
            upvote: req.body.upvote,

        }
    );
    var tagString=req.body.tag;
    var tags= tagString.split(",");
    for(var i=0;i<tags.length;i++)
    {
        //console.log(tags[i]+"\n");
        post.tag.push(tags[i]);
    }
    post.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('post Created successfully')
    });
    var logItem=req.body.username + " created a new post";
    let log = new Log(
        {
            item:logItem
        });
    log.save(function (err) {
        if (err) {
            return next(err);
        }
    })
};


exports.add_comment = function (req, res) {
    let comment = new Comment(
        {
            articleid: req.params.id,
            comment: req.body.comment,
            user: req.body.user
        }
    );
    comment.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('comment added successfully')
    });
    var logItem=req.body.user + " Commented on " + req.params.id;
    let log = new Log(
        {
            item:logItem
        });
    log.save(function (err) {
        if (err) {
            return next(err);
        }
    })

};


exports.show_posts = function (req , res) {
    Post.find({flag:true}).then(function (posts) {
    res.send(posts);
    });
   };

exports.show_posts_by_company = function (req , res) {
       Post.find({companyid:req.params.cid,flag:true}).then(function (posts) {
       res.send(posts);
       });
      };

exports.search = function (req , res) {

    var searchitem=req.body.searchitem;
    var keywords=searchitem.split(" ");
    console.log(searchitem);
    Post.find({tag:{$in: keywords} }, function (err, post) {
        res.send(post);
    });

};

exports.show_post = function (req, res) {
    Post.find({_id:req.params.id,flag:true}, function (err, post) {
        if (err) return next(err);
        res.send(post);
    })
};

exports.get_comment_by_id = function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.send(post);
    });
};

exports.comments_by_articleid = function(req, res, next) {
    Comment.find({articleid: req.params.id }, function (err, post) {
        if (err) return next(err);
        console.log(post);
        res.send(post);
    });
};

exports.show_log = function (req , res) {
    Log.find({}).then(function (logs) {
        res.send(logs);
    });

};

exports.show_users_to_admin = function (req , res) {
    var x=req.params.cid;
    var company_name;
    switch(x){
        case '1':{company_name="BDL"; break;}
        case '2':{company_name="HAL"; break;}
        case '3':{company_name="BHEL"; break;}
        case '4':{company_name="GS"; break;}
        default:res.send("admin not identified");
    }

    User.find({companyname:company_name},function (err,users) {
       res.send(users);
    });
};

exports.deletepost_admin = function (req , res) {
    var x=req.params.cid;
    var aid=req.params.aid;
    var company_name;
    switch(x){
        case '1':{company_name="BDL"; break;}
        case '2':{company_name="HAL"; break;}
        case '3':{company_name="BHEL"; break;}
        case '4':{company_name="GS"; break;}
        default:res.send("admin not identified");
    }

    Post.deleteOne({_id:aid,companyid:x},function (err,post) {
        res.send(aid+" deleted ");
    });
};

exports.deleteuser_admin = function (req , res) {
    var x=req.params.cid;
    var eid=req.params.eid;
    var company_name;
    switch(x){
        case '1':{company_name="BDL"; break;}
        case '2':{company_name="HAL"; break;}
        case '3':{company_name="BHEL"; break;}
        case '4':{company_name="GS"; break;}
        default:res.send("admin not identified");
    }

    User.deleteOne({eid:eid,companyname:company_name},function (err,post) {
        res.send(eid+" deleted ");
    });
};

// exports.comments_by_articleid = function (req , res) {
//     Comment.find({articleid: req.params.id}).then(function (comments) {
//         console.log(comments);
//     res.send(comments);
//     });
//    };



// exports.get_comment_by_id = function (req , res) {
//     Post.find({}).then(function (posts) {
//     res.send(posts);
//     });
//    };


// exports.product_details = function (req, res) {
//     Product.findById(req.params.id, function (err, product) {
//         if (err) return next(err);
//         res.send(product);
//     })
// };


// exports.product_details = function (req, res) {
//     Product.findById(req.params.id, function (err, product) {
//         if (err) return next(err);
//         res.send(product);
//     })
// };



// exports.add_comment = function (req, res) {
//       var comment_obj = { text: req.body.text};
//     Post.findOneAndUpdate(
//    { _id: req.params.id }, {new: true, useFindAndModify: false},
//    { $push: { comments: comment_obj } },
//   function (error, success) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(success);
//         }
//     });
// };


// exports.user_details = function (req, res) {
//     User.findById(req.params.id, function (err, user) {
//         if (err) return next(err);
//         res.json(user);
//     })
// };
