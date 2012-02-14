
/*
 * add member
 */
var Manager = require('../lib/amida').Manager;

// 参加者追加
exports.index = function(req, res) {

  // @todo validation

  // @todo delete test code
  var id = "4f32a813ae62f1344a00000f";

  var users = [
    {name: 'User3-1', position: 1}
    , {name: 'User3-2', position: 2}
    , {name: 'User3-3', position: 3}
    , {name: 'User3-4', position: 4}
  ];

  Manager.join(id, users, function(err) {
    // @todo something
  });

  // redner
  res.render('index', { title: 'Express' })
}