
/*
 * view amida
 */
var Manager = require('../lib/amida').Manager;

exports.index = function(req, res){

  // @todo validation

  // @todo delete test code
  var url = "Wr9u9DhGKZRteGoFyskYYw9Ev57wbkiq5PtM52nLDdioXANM9VQhdphziEFWcfzq";

  Manager.find(url, function(err, amida) {
    // @todo something
    console.log(amida);
  });

  // redner
  res.render('index', { title: 'Express' })
};