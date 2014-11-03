/*! 
 * 棉花糖 管理员个人设置业务
 * @author Fredric 
 * @date 2014-09-28
 */

var userdao = require('../admindao/user');

exports.updatePassword = function(req,callback){
	
	userdao.findUser({username:req.session.username},function(err,user){
		
		if(err || null === user){
			return callback("failed","用户不存在");
		}else{
						
			if(req.param('oldpw') != user.password){
				return callback("failed","原始密码错误");
			}
			
			var newuser = {
				username:user.username,
				password:req.param('newpw1'),
				note    :user.note,
			};
								
			userdao.updateUser(newuser,function(err){
				console.log(err);
				if(err){
					return callback("failed","密码更新失败");
				}else{
					return callback("success",null);
				}
			});
		}
	});
}