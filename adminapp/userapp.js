/*! 
 * 棉花糖 管理员用户管理业务业务
 * @author Fredric 
 * @date 2014-09-28
 */

var userdao = require('../admindao/user');


/*-
 * 增加一个新用户
 */
exports.addAdminUser = function(req,callback){
	
	userdao.findUser({username:req.body.username},function(err,user){
		if(err || null === user){
			var input = {
					'username':	req.body.username,
					'password': req.body.password,
					'note'	  : req.body.note,
				};
			
			userdao.addUser(input,function(err){
				return callback(err);
			})
		}else{
			return callback("repeat");
		}
	});
}

/*-
 * 更新一个新用户
 */
exports.updateAdminUser = function(req,callback){
	var input = {
			'username':	req.body.username,
			'password': req.body.password,
			'note'	  : req.body.note,
		};
	
	userdao.updateUser(input,function(err){
		return callback(err);
	});
}

