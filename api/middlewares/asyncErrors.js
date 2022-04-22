module.exports = func => (req, res, next) => 
  Promise.resolve(func(req,res,next))
    .catch(next);


    // function( function(req, res, next)) {
    //   return Promise.resolve(function(req, res, next)).catch(next);
    // }