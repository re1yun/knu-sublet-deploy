// util.js

var util = {};

util.parseError = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } 
  else if(errors.code == '11000' && errors.errmsg.indexOf('userID') > 0) {
    parsed.userID = { message:'This username already exists!' };
  } 
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } 
  else {
    req.flash('errors', {login:'Please login first'});
    res.redirect('/user/sign_in');
  }
}

util.noPermission = function(req, res){
  req.flash('errors', {login:"You don't have permission"});
  req.logout();
  res.redirect('/user/sign_in');
}

util.getPostQueryString = function(req, res, next){
  res.locals.getPostQueryString = function(isAppended=false, overwrites={}){    
    var queryString = '';
    var queryArray = [];
    var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
    var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');
    var searchType = overwrites.searchType?overwrites.searchType:(req.query.searchType?req.query.searchType:'');
    var searchText = overwrites.searchText?overwrites.searchText:(req.query.searchText?req.query.searchText:'');

    if(page) queryArray.push('page='+page);
    if(limit) queryArray.push('limit='+limit);
    if(searchType) queryArray.push('searchType='+searchType);
    if(searchText) queryArray.push('searchText='+searchText);

    // if there is at least one query added to array, create queryString. if it is being appended to existing query, add '&' in front, else start new string with '?'
    // plus, join() function adds all elements of array into one string with '&' in between
    if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');

    return queryString;
  }
  next();
}

module.exports = util;