/*! 
 * 棉花糖  企业租户对应的管理员
 * @author Fredric 
 * @date 2014-10-4
 */
var db = require('../util/dbmanager');
var set = require('../util/hashmap');
var mongoose = db.mhtdb().mongoose;
var Schema   = db.mhtdb().Schema;

var enterUser = new Schema({
	username:	{
        type: String
    },
	password:   {
        type: String
    },
	actor :   [{ //一个用户包含多个角色
        actorname:{type: String}
    }],
    note   :   {
    	type: String
    }
});


var modelmap = new set.hashmap();

function getModel(ID){
	if(null != modelmap.get(ID)){
		return modelmap.get(ID);
	}else{
		var enterUserModel = db.getEnterDb(ID).model('userModel',enterUser,'user');
		modelmap.put(ID,enterUserModel);
		return enterUserModel;
	}	
}

/*-
 * 增加租户企业企业管理员用户信息；
 * @ID：企业租户ID
 * @info：用户信息
 * @callback:回调函数
 */
exports.addEnterUser = function(ID,info,callback){
	var entity = new getModel(ID)({
		username:info.username,
		password:info.password,
		actor:info.actor,
		note:info.note,
	});
	
	entity.save(function(err){
		return callback(err);
	});	
}

/*-
 * 获取租户的管理员列表
 * @ID：企业ID
 * @option:选择条件
 * @callback:回调函数
 */
exports.getUser = function(ID,option,callback){
	getModel(ID).find(option,function(err,users){
		return callback(err,users);
	});
}

/*-
 * 删除用户
 */
exports.delUser = function(ID,username,callback){
	getModel(ID).findOne({"username":username},function(err,user){
		if(err || null === user){
			return callback(err);
		}else{
			user.remove(function(err){
				return callback(err);
			});
		}
	});
}


