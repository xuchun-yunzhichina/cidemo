/*! 
 * 棉花糖 管理员登陆业务
 * @author Fredric 
 * @date 2014-09-28
 */

var user = require('../admindao/user');

exports.loginHandler = function(req,callback){
	var inputnm = req.param('username');
	var inputpw = req.param('password');
	
	//查询数据库并刷新session
	user.findUser({"username":inputnm},function(err, user){
		if(err || null == user){
			return callback("failed","用户名不存在");
		}else{
			console.log(user);
			if(inputpw == user.password){
				req.session.username = inputnm;
				req.session.status   = "active";
				return callback("success");
			}else{
				return callback("failed","用户名或密码错误");
			}
		}
	});	
}
