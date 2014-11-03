/*! 
 * 棉花糖 企业用户员工管理业务
 * @author Fredric 
 * @date 2014-10-22
 */

var empdao 		= require("../pubdao/employee");
var tenantdao 	= require("../admindao/tenant");

/*-
 * 增加通讯录中的员工信息
 * 1、在企业通讯录表格中增加员工信息；
 * 2、在系统租户表中增加系统用户登陆信息；
 */
exports.addEmployee = function(req,callback){	
	var employee   = {};
	employee.name  = req.param("name");
	employee.sex   = req.param("sex");
	employee.age   = req.param("age");
	employee.email = req.param("email");
	employee.phone = eval(req.param("phones"));
	employee.dept  = eval(req.param("depts"));
	employee.note  = req.param("note");
	
	var enterid    = req.session.enterid;
		
	empdao.addEmployee(enterid,employee,function(err){
		
		//增加入tenant 系统登录表
		//将员工手机联系方式作为用户名录入，密码暂定为固定值
		var data = new Array();
		for(var i = 0; i < employee.phone.length; i++){
			if(employee.phone[i].number.length == 11){ //区分固话和手机号
				data.push({'username':employee.phone[i].number,'password':'123456'});
			}
		}
		
		tenantdao.addTenantUser(enterid,data,function(err){
			return callback(err);
		});

	});
}


//获取员工数据
//主要是适配前端表格显示格式，为非展开的主要数据
exports.getEmployeeInfo = function(req,callback){
	
	var enterid = req.session.enterid;
	
	empdao.getEmployee(enterid,{},function(err,employees){
		if(err){
			return callback(err);
		}else{
			
			var data = new Array();
			
			for(var i = 0; i < employees.length; i++){				
				var node  = {};
								
				node.name   = employees[i].name;
				node.sex    = employees[i].sex;
				node.age    = employees[i].age;
				node.email  = employees[i].email;
				node.note   = employees[i].note;
				
				node.dept   = employees[i].depart[0].text;
				node.phone  = employees[i].phone[0].number;
				
				data.push(node);		
			}		
			return callback(null,data);			
		}
	});	
}

/*-
 * 获取员工详细信息
 */
exports.getEmployeeDetail = function(req, callback){
	
	var name    = req.param("name");
	var phone   = req.param("phone");
	var enterid = req.session.enterid;
	
	//考虑有重名的情况，附带用电话号码识别
	empdao.getEmployee(enterid,{"name":name},function(err,employees){
		if(err){
			return callback(err,null,null);
		}else{
			
			for(var i = 0; i < employees.length; i++){
				if(phone == employees[i].phone[0].number){
				//确认改用户，返回详细页面
					var details = new Array();
					
					var strphone = "";
					
					for(var j = 0; j < employees[i].phone.length; j++){
						strphone += employees[i].phone[j].number;
						strphone += ";";

					}
					
					details.push({"type":"联系方式","details":strphone});
					
					var strdept = "";
					
					for(var j = 0; j < employees[i].depart.length; j++){
						strdept += employees[i].depart[j].text;
						strdept += ";"
					}
					
					details.push({"type":"部门列表","details":strdept});
									
					return callback(null,details);
				}
			}			
			return callback("failed",null,null);			
		}
	});
}

/*-
 * 删除一条员工记录
 * 1、在系统通讯录表中删除员工信息；
 * 2、在租户表的登陆用户信息中删除该员工全部手机号关联；
 */
exports.delEmployee = function(req,callback){
	var name  	= req.param("name");
	var phone 	= req.param("phone");
	var enterid = req.session.enterid;
	
	empdao.getEmployee(enterid,{"name":name},function(err,employees){
		if(err){
			return callback(err);
		}else{
			
			for(var i = 0; i < employees.length; i++){
				if(phone == employees[i].phone[0].number){
					
					var temp = employees[i];
					
					employees[i].remove(function(err){
						
						//在系统租户表中删除
						tenantdao.findTenantByID(enterid,function(err,tenant){
							if(err){
								return callback(err);
							}else{
								
								for(var i = 0; i < tenant.user.length; i++){							
									for(var j = 0; j < temp.phone.length; j++){
										if(temp.phone[j].number == tenant.user[i].username){
											tenant.user.splice(i,1);
											break;
										}
									}																	
								}
								
								tenantdao.updateUser(enterid,{"user":tenant.user},function(err){
									return callback(err);
								});								
							}
						});						
					});
				}
			}
		}
	});
}


//导出数据，可形成csv格式
exports.exportData = function(req,callback){
	var enterid = req.session.enterid;
	
	empdao.getEmployee(enterid, {},function(err,employees){
		if(err){
			return callback(err,null);
		}else{
			
			var data = new Array();
			for(var i = 0; i < employees.length; i++){
				var node = {};
				node.name   = employees[i].name;
				node.sex    = employees[i].sex;
				node.age    = employees[i].age;
				node.email  = employees[i].email;
				node.note   = employees[i].note;
				node.dept   = "";
				node.phone  = "";
				
				for(var j = 0; j < employees[i].depart.length;j++){
					node.dept += employees[i].depart[j].text;
					node.dept +="/";
				}
				
				for(var j = 0; j < employees[i].phone.length;j++){
					node.phone += employees[i].phone[j].number;
					node.phone +="/";
				}
				
				data.push(node);
			}
			
			return callback(null,data);
		}
	});
}


//导入数据
exports.importData = function(req,callback){
	console.log("importData");
	console.log(req.files);
}




