/*! 
 * 棉花糖 管理员租户数据DAO封装
 * @author Fredric 
 * @date 2014-09-28
 */

var db = require('../util/dbmanager');
var mongoose = db.mhtdb().mongoose;
var Schema   = db.mhtdb().Schema;
var con      = db.mhtdb().con;

var tenantSchema = new Schema({
	ID:	{
        type: String
    },
	password:   {
        type: String
    },
	entername :   {
        type: String
    },
    user:[{
    	username:{type:String}, //采用手机号，需要全局唯一
    	password:{type:String}
    }]
});


var tenantModel = con.model('tenantModel',tenantSchema  ,'tenant');

exports.addTenant = function(id,password,entername,callback){
	
	var tenantEntity = new tenantModel({
		ID:id,
		password:password,
		entername:entername,
	});
		
	tenantEntity.save(function(err){
		return callback(err);
	});
}

//查找租户
exports.findTenant = function(option,callback){
	tenantModel.find(option,function(err,tenants){
		return callback(err,tenants);
	});
}

exports.findTenantByID = function(ID,callback){
	tenantModel.findOne({"ID":ID},function(err,tenant){
		return callback(err,tenant);
	});
}

//更新租户
exports.updateTenant = function(id,tenant,callback){
	
	tenantModel.findOneAndUpdate({'ID':id},tenant,function(err){
		return callback(err);
	});
}

//删除指定ID的租户
exports.delTenantById = function(id,callback){
	tenantModel.findOne({'ID':id},function(err, tenant){		
		if(err || null === tenant){
			return callback(err);
		}else{
			tenant.remove(function(err){
				return callback(err);
			});
		}
	});
}

/*-
 * 在租户表中添加用户登陆信息
 * @id:企业租户Id
 * @username:企业用户名称
 * @password:企业用户密码
 * @callback:回调函数
 */
exports.addTenantUser = function(id,user,callback){
	tenantModel.findOne({ID:id},function(err,tenant){
				
		if(err || null == tenant){
			return callback("failed");
		}else{
			
			for(var i = 0; i < user.length; i++){
				tenant.user.push({'username':user[i].username,'password':user[i].password});
			}
				
			//更新tenant集合
			tenantModel.findOneAndUpdate({'ID':id},{'user':tenant.user},function(err){
				return callback(err);
			});		
		}
	});
}

/*-
 * 在租户表中删除用户登陆信息
 * @id:企业租户Id
 * @username:企业用户名称
 * @callback:回调函数
 */
exports.delTenantUser = function(id,username,callback){
	
	var tmp = false;
	
	tenantModel.findOne({ID:id},function(err,tenant){
		if(err || 0 == tenant.length){
			return callback("failed");
		}else{
			for(var i = 0; i < tenant.user.length; i++){
				if(username == tenant.user[i].username){
					tenant.user.splice(i,1);
					tmp = true;
					break;
				}
			}
			
			var obj = { user:tenant.user};
			
			//更新tenant集合
			if(true == tmp){
				tenantModel.findOneAndUpdate({'ID':id},obj,function(err){
					return callback(err);
				});	
			}else{
				return callback(null);
			}
		}		
	});
}

/*-
 * 更新租户表中的用户密码
 * @id:企业租户Id
 * @username:企业用户名称
 * @password:企业用户密码
 * @callback:回调函数
 */
exports.upTenantUser = function(id,username,password,callback){
	
	var tmp = false;
	
	tenantModel.findOne({ID:id},function(err,tenant){
		if(err || 0 == tenant.length){
			return callback("failed");
		}else{
			
			for(var i = 0; i < tenant.user.length; i++){
				if(username == tenant.user[i].username){
					tenant.user[i].password = password;
					tmp = true; 
					break;
					}
			}
			
			var obj = { user:tenant.user};
			
			//更新tenant集合
			if(true == tmp){
				tenantModel.findOneAndUpdate({'ID':id},obj,function(err){
					return callback(err);
				});	
			}else{
				return callback(null);
			}
		}
	});
}


exports.updateUser = function(ID,option,callback){
	tenantModel.findOneAndUpdate(ID,option,function(err){
		return callback(err);
	});
}
