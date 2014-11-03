/*! 
 * 棉花糖 企业公共业务登陆界面
 * @author Fredric 
 * @date 2014-10-14
 */


var tenantdao = require("../admindao/tenant");

/*-
 * 企业用户登陆
 */
exports.loginAction = function(req,callback){
	var username = req.param("username");
	var password = req.param("password");
	
	var temp = false;
	
	tenantdao.findTenant({},function(err,tenants){
		if(err || 0 == tenants.length){
			return callback("failed",null,null);
		}else{
			for(var i = 0; i < tenants.length; i++){				
				for(j = 0; j < tenants[i].user.length; j++){
					if(username == tenants[i].user[j].username){
						temp = true;
						
						if(password == tenants[i].user[j].password){
							return callback("success",tenants[i].ID,tenants[i].entername);
						}else{
							return callback("failed",null,null);
						}											
					}
				}
			}//for(var i = 0; i < tenants.length; i++){
			
			if(false == temp){
				return callback("failed",null,null);
			}
		}
	});
}


/*-
 * 企业用户注销
 */
exports.publogout = function(req,callback){
	
}