
/** error handling */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

