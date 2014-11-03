/*! 
 * 棉花糖 管理员租户管理业务
 * @author Fredric 
 * @date 2014-10-13
 */

var tenantdao = require("../admindao/tenant");

//增加租户
exports.addTenant = function(req,callback){
	
	tenantdao.findTenant({ID:req.body.ID},function(err,tenants){
		
		if(!err && 0 != tenants.length){
			return callback("failed","用户名重复");
		}else{
			tenantdao.addTenant(req.body.ID,req.body.password,req.body.entername,function(err){
				return callback(err,"null");
			});
		}
	});
}

//更新租户
exports.updateTenant = function(req,callback){
	var tenant = {
			id			:req.body.ID,
			password	:req.body.password,
			entername	:req.body.entername,
	};
	
	tenantdao.updateTenant(req.param("id"),tenant,function(err){
		return callback(err);
	});
}

//删除租户
exports.delTenant = function(req,callback){
	tenantdao.delTenantById(req.param("id"),function(err){
		return callback(err);
	});
}

//获取租户列表
exports.getTenant = function(req,callback){
	tenantdao.findTenant({},function(err,tenants){
		if(err){
			return callback("failed");
		}else{
			var data = new Array();
			
			for(var i = 0; i < tenants.length; i++){
				var node 		= {};
				node.ID 		= tenants[i].ID;
				node.password  	= tenants[i].password;
				node.entername 	= tenants[i].entername;
				node.count     	= tenants[i].user.length;
				data.push(node);
			}						
			return callback(null,data);
		}		
	});
}

