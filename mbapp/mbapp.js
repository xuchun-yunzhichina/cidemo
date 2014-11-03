/*! 
 * 首页业务处理
 * @author Fredric 
 * @date 2014-10-24
 */
var tenantdao = require("../admindao/tenant");
var deptdao   = require("../pubdao/dept");
var empdao    = require("../pubdao/employee");

/*-
 * 处理手机用户登陆操作
 */
exports.mbLoginAction = function(req,callback){
	
	var username = req.param("username");
	var password = req.param("password");
	
	tenantdao.findTenant({},function(err,tenants){
		if(err){
			return callback(err);
		}else{
			
			for(var i = 0 ;i < tenants.length; i++){
				
				for(var j = 0; j < tenants[i].user.length; j++){
					if((username == tenants[i].user[j].username)
					&& (password == tenants[i].user[j].password)){
						
						//保存session
						req.session.enterid  = tenants[i].ID;
						req.session.username = username;
					
						return callback(null);					
					}				
				}
			}
			
			return callback("failed");		
		}
	});	
}

/*-
 * 获取通讯录列表
 * [{
 * 		id  : {type:String}, //部门ID
 * 		name: {type:String}, //部门名称
 * 		list: [{
 * 			name:{type:String}
 * 		}]
 * }]
 * 备注：手机端仅采用一级目录展开
 */
exports.getAdreesList = function(enterid,callback){
	
	deptdao.getDeptInfo(enterid, function(err,dept){
		
		if(err){
			return callback(err);
		}else{
			
			var data = new Array();
			empdao.getEmployee(enterid,{},function(err,employees){
				if(err){
					return callback(err);
				}else{
					
					for(var i = 0; i < dept.subdept.length; i++){
						var node = {};
						node.id   = dept.subdept[i].id;
						node.text = dept.subdept[i].text;
										
						node.list = new Array();
						
						for(var j = 0; j < employees.length; j++){
							var tmp = {};
							if(true == judgeEmployee(node.id,employees[j].depart)){
								tmp.name = employees[j].name;								
								node.list.push(tmp);
							}							
						}
						data.push(node);			
					}
					
					return callback(null,data);	
					
				}
				
			});
					
		}
	});
}

//判断该员工是否属于该部门
function judgeEmployee(departid,depart){
	
	for(var i = 0; i < depart.length; i++){
		if(-1 != depart[i].id.indexOf(departid,0)){		
			return true;
		}
	}
	
	return false;
}

/*-
 * 获取个人详细信息
 * {
 * 		name:	 {type: String},
		phone:   [{
					number: {type: String}}],
		email:   {type: String},
		depart:  [{
        			id:{type:String},
        			text:{type:String}}],
		note:    {type: String}
 * }
 */
exports.getAddressDetail = function(enterid,name,callback){	
	empdao.getEmployee(enterid,{"name":name},function(err,employees){
		if(err){
			return callback(err);
		}else{
			//未考虑重名
			/*var temp = {};
			console.log(employees[0]);
			temp.name  = employees[0].name;
			temp.phone = new Array();
			console.log(employees[0].phone.length);
			for(var i = 0; i < employees[0].phone.length; i++){
				temp.phone.push(employees[0].phone[i]);
			}

			temp.phone = employees[0].email;
			
			console.log(temp);*/
			
			return callback(null,employees[0]);
			
		}
	});
}

//获取个人信息
exports.getPrivateDetail = function(req,callback){
	
	var enterid = req.session.enterid;
	var phone   = req.session.username;//手机号登陆
	
	empdao.getEmployee(enterid,{},function(err,employees){
		if(err){
			return callback(err);
		}else{
			for(var i = 0; i < employees.length; i++){
				
				for(var j = 0; j < employees[i].phone.length; j++){
					if(phone == employees[i].phone[j].number){
						return callback(null,employees[i])
					}
				}		
			}
			
			return callback(err);
			
		}
	});
	
}

//修改个人密码
exports.upPrivatePW = function(req,callback){
	var username = req.session.username;
	var enterid  = req.session.enterid;
	var oldpw = req.param("oldpassword");
	var newpw = req.param("newpassword");
	
	tenantdao.findTenantByID(enterid,function(err,tenant){
		if(err){
			return callback(err);
		}else{
			for(var j = 0; j < tenant.user.length; j++){
				console.log(tenant.user);
				if((username == tenant.user[j].username)
				&& (oldpw == tenant.user[j].password)){
					console.log(oldpw);
					tenantdao.upTenantUser(enterid,username,newpw,function(err){
						return callback(err);
					});		
				}				
			}
			
			return callback("failed");
		}
		
	});
	

}





