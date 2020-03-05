exports.getPosts = (req, res, next) => {
  res.json({
      posts:[
          {
              title:'first post #1',
              message:'This is my first post'
          }
      ]
  });
};
