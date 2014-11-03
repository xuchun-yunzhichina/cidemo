/*! 
 * 棉花糖 管理员用户数据DAO封装
 * @author Fredric 
 * @date 2014-09-28
 */

var db = require('../util/dbmanager');
var mongoose = db.mhtdb().mongoose;
var Schema   = db.mhtdb().Schema;
var con      = db.mhtdb().con;


var userSchema = new Schema({
	username:	{
        type: String
    },
	password:   {
        type: String
    },
    note:       {
    	type: String
    }
});


var userModel = con.model('userModel',userSchema,'user');


/*-
 * 根据条件搜索一条管理员用户
 * 例option -> {'username':  name}
 */
exports.findUser = function(option,callback){
	userModel.findOne(option,function(err, doc){		
		return callback(err,doc);	
	});
}

/*-
 * 搜索全部用户
 */
exports.findAllUsers = function(callback){
	userModel.find(function(err,users){
		return callback(err,users);
	});
}

/*-
 * 增加用户
 * 
 */
exports.addUser = function(user,callback){
	var entity = new userModel({
		username:user.username,
		password:user.password,
		note:    user.note
	})
	
	entity.save(function(err){
		return callback(err);
	});
}

/*-
 * 跟新用户
 */
exports.updateUser = function(user,callback){
	userModel.findOneAndUpdate({'username':user.username},user,function(err){
		return callback(err);
	});
}

/*-
 * 根据用户名删除用户
 */
exports.delUserByName = function(username,callback){
	userModel.findOne({'username':username},function(err, user){		
		if(err){
			return callback(err);
		}else{
			user.remove(function(err){
				return callback(err);
			})
		}
	});
}
