/*! 
 * 系统访问路由
 * @author Fredric 
 * @date 2014-10-4
 */
/*-**************************************************************************************
 * 公共函数
 */
function filter(req,res,callback){
	//if(req.session.username != null && req.session.status == "active"){
	if(true){ //测试节点不做过滤	
		return callback();
	}else{
		res.redirect('/login');
	}
}

/*-**************************************************************************************
 * 管理员访问路由
 */
exports.adminLogin = function(req, res){
	res.sendfile('views/admin/login.html');
};

exports.adminlogout = function(req,res){
	
	console.log(req.session.username + 'adminlogout');
	
	req.session.username = null;
	req.session.status   = "not active"
	
	res.json({result:'success'});
}

var adminLogin = require('../adminapp/login');

//系统管理员登陆
exports.loginAction = function(req,res){
	adminLogin.loginHandler(req,function(result,errMsg){
				
		if('success' === result){
			res.json({result:'success'});
		}else{
			res.json({result:'failed',errMsg:errMsg});
		}
	})
}

//系统管理员跳转至首页
exports.adminIndex = function(req,res){	
	filter(req,res,function(){
		res.sendfile('views/admin/index.html');
	});	
}

//系统管理员用户配置
exports.adminUser = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/admin/user.html');
	});
}

var user = require('../admindao/user');
var userapp = require('../adminapp/userapp');
var personapp = require('../adminapp/personapp');

//获取管理员用户
exports.getAdminUser = function(req,res){
	filter(req,res,function(){
		user.findAllUsers(function(err,users){
			res.json(users);
		});	
	});
}

//添加管理员用户
exports.addAdminUser = function(req,res){	
	filter(req,res,function(){
		
		userapp.addAdminUser(req,function(err){
			
			if('repeat' === err){				
				res.json({result:'failed',errMsg:'用户名重复'});
			}else{
				if(err){
					res.json({result:'failed',errMsg:'数据库插入错误'});
				}else{
					res.json({result:'success'});
				}
			}
		})
	});
}

//跟新管理员用户
exports.updateAdminUser = function(req,res){
	filter(req,res,function(){
			
		userapp.updateAdminUser(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'数据更新错误'});
			}else{
				res.json({result:'success'});
			}
		});	
	});
}

//删除管理员用户
exports.delAdminUser = function(req,res){
	filter(req,res,function(){
		user.delUserByName(req.param('username'),function(err){
			if(err){
				res.json({result:'failed',errMsg:'数据删除错误'});
			}else{
				res.json({result:'success'});
			}
		});
	});
}

//系统管理员跳转至个人设置
exports.adminPerson = function(req,res){	
	filter(req,res,function(){
		res.sendfile('views/admin/person.html');
	});	
}

//更新密码
exports.updatePw = function(req,res){
	personapp.updatePassword(req,function(result,errMsg){
		res.json({result:result,errMsg:errMsg});
	});
}

var tenantdao = require("../admindao/tenant");
var tenantapp = require("../adminapp/tenantapp");

exports.adminTanent = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/admin/tenant.html');
	});	
}

//获取租户列表
exports.getTenant = function(req,res){
	filter(req,res,function(){
		tenantapp.getTenant(req,function(err,tenants){
			if(err || null === tenants){
				res.json({result:'failed',errMsg:'无法获取租户信息'});
			}else{
				res.json(tenants);
			}
		})
	})
}

//增加租户
exports.addTenant = function(req,res){
	filter(req,res,function(){
		tenantapp.addTenant(req,function(err,errMsg){
					
			if(err){
				if("failed" == err){
					res.json({result:'failed',errMsg:errMsg});
				}else{
					res.json({result:'failed',errMsg:'数据增加失败'});
				}			
			}else{
				res.json({result:'success'});
			}
		})
	});	
}

//更新租户
exports.updateTenant = function(req,res){
	filter(req,res,function(){
		tenantapp.updateTenant(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'数据更新失败'});
			}else{
				res.json({result:'success'});
			}
		})
	});	
}

//删除租户
exports.delTenant = function(req,res){
	filter(req,res,function(){
		tenantapp.delTenant(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'数据删除失败'});
			}else{
				res.json({result:'success'});
			}
		});
	});	
}


var logapp = require("../adminapp/logapp");

exports.getLogInfo = function(req,res){

	logapp.logHandler(req,function(err,log){
		if(!err && null != log){
			res.json(log);
		}	
	});
}


/*-
 * 系统日志管理
 */
exports.adminLog = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/admin/log.html');
	});
}


var backupapp = require("../adminapp/backupapp");
var syslogdao = require("../admindao/syslogdao");

/*-
 * 系统数据备份
 */
exports.doBackup = function(req,res){
	filter(req,res,function(){
		backupapp.backupHandler(req,function(err,errMsg){
			if(err){
				res.json({result:'failed',errMsg:'数据备份失败'});
			}else{
				res.json({result:'success'});
			}
		});
	});	
}

exports.adminBackUp = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/admin/backup.html');
	});	
}

/*-
 * 返回当前的备份信息
 */
exports.getBackUpLog = function(req,res){
	filter(req,res,function(){
		syslogdao.getBackupLog({},function(err,logs){
			if(!err){
				res.json(backupapp.formatBackupLog(logs));
			}
		});
	});
}

/*-
 * 管理员报表
 */
var reportapp = require("../adminapp/reportapp");

exports.getAdminReport = function(req,res){
	filter(req,res,function(){
		res.sendfile("views/admin/report.html");
	});
}

exports.getAdminReport1 = function(req,res){
	filter(req,res,function(){
		reportapp.getAdminReport1(function(err,data){
			if(!err){
				res.send(data);
			}
		});
	})	
}

/*-**************************************************************************
 * 企业租户访问路由
 */
var register = require("../pubapp/register");
var login    = require("../pubapp/login");

exports.login = function(req,res){
	res.sendfile('views/main/index.html');
}

//企业租户登陆
exports.pubLogin = function(req,res){
	login.loginAction(req,function(result,id,entername){
				
		if("failed" == result){
			res.json({result:'failed',errMsg:'用户名或密码错误'});
		}else{
			//session添加
			console.log(req.param("username") + ' login');
			
			req.session.username = req.param("username");
			req.session.status   = "active"
			req.session.enterid  = id;
					
			res.json({result:'success'});		
		}
	});
}

//企业租户注销
exports.pubLogout = function(req,res){
	console.log(req.session.enterid + ":" + req.session.username + 'adminlogout');
	
	req.session.username = null;
	req.session.status   = "not active"
	req.session.enterid  = null;
	
	res.json({result:'success'});
}


exports.employee = function(req,res){
	res.sendfile('views/pub/employee.html');
}

exports.register = function(req,res){
	register.regHandler(req,function(err,errMsg){
		if(err){
			res.json({result:'failed',errMsg:errMsg});
		}else{
			req.session.username = req.body.ID;
			req.session.status   = "active"
			req.session.enterid  = req.body.ID;
			res.json({result:'success'});
		}
	})
}

exports.index = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/pub/index.html');
	});
}


var deptapp = require("../pubapp/deptapp");

exports.dept  = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/pub/dept.html');
	});
}


//获取部门信息
exports.getDeptInfo = function(req,res){
	filter(req,res,function(){
		deptapp.getDeptInfo(req.session.enterid,function(err,dept){		
			if(!err){
				res.json(dept);
			}		
		});
	});
}

//增加一个部门节点
exports.addDeptNode = function(req,res){
	filter(req,res,function(){
		deptapp.addDeptNode(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'新增部门失败'});
			}else{
				res.json({result:'success'});
			}
		});	
	})
}

//删除一个部门节点
exports.delDeptNode = function(req,res){
	filter(req,res,function(){
		deptapp.delDeptNode(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'删除部门失败'});
			}else{
				res.json({result:'success'});
			}
		});	
	});	
}


//编辑一个部门节点
exports.upDeptNode = function(req,res){
	filter(req,res,function(){
		deptapp.upDeptNode(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'修改部门失败'});
			}else{
				res.json({result:'success'});
			}
		});	
	})
	
	
}

var empapp = require("../pubapp/employeeapp");

//员工管理入口
exports.getEmployee = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/pub/employee.html');
	});
}

exports.addEmployee = function(req,res){
	filter(req,res,function(){
		empapp.addEmployee(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'新增员工信息失败'});
			}else{
				res.json({result:'success'});
			}
		});
		
	});
}


//获取员工信息初步（表格未展开）
exports.getEmployeeInfo = function(req,res){
	filter(req,res,function(){
		empapp.getEmployeeInfo(req,function(err,employees){
			if(err){
				res.json({result:'failed',errMsg:'获取员工信息失败'});
			}else{
				res.json(employees);
			}
		});
	});
}

exports.getEmployeeDetail = function(req,res){
	filter(req,res,function(){
		empapp.getEmployeeDetail(req,function(err,details){
			if(err){
				res.json({result:'failed',errMsg:'获取员工信息失败'});
			}else{
				res.json(details);				
			}
		});
	});
}


exports.delEmployee = function(req,res){
	filter(req,res,function(){
		empapp.delEmployee(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'删除员工信息失败'});
			}
		});
	});
}

exports.upEmployee = function(req,res){
	
}

//导入数据
exports.importData = function(req,res){
	filter(req,res,function(){
		empapp.importData(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'删除员工信息失败'});
			}else{
				res.json({result:'success'});
			}
		});
		
	})
}

//导出数据
exports.exportData = function(req,res){
	filter(req,res,function(){
		empapp.exportData(req,function(err,data){
			if(err){
				res.json({result:'failed',errMsg:'导出员工信息失败'});
			}else{
				res.json(data);
			}
		});
	})
}

//租户企业的用户管理
exports.enterUser = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/pub/user.html');
	});
}

var pubuser = require("../pubdao/user");
var userapp = require("../pubapp/userapp");


//获取企业租户的管理员
exports.getUser = function(req,res){
	filter(req,res,function(){
		pubuser.getUser(req.session.enterid,{},function(err,users){
			if(!err){
				userapp.formatUser(users,function(output){
					res.json(output);
				});				
			}
		});
	});
}


//新增用户
exports.addUser = function(req,res){
	filter(req,res,function(){
		userapp.addUser(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'新增用户失败'});
			}else{
				res.json({result:'success'});
			}		
		});	
	});
}

//删除用户
exports.delUser = function(req,res){
	filter(req,res,function(){
		pubuser.delUser(req.session.enterid,req.param("username"),function(err){
			if(err){
				res.json({result:'failed',errMsg:'删除用户失败'});
			}else{
				res.json({result:'success'});
			}
		});	
	});
}


var actordao = require("../pubdao/actor");

//企业租户的权限管理
exports.enterActor = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/pub/actor.html');
	});	
}

//获取角色列表
exports.getActor = function(req,res){
	filter(req,res,function(){
		userapp.getActor(req.session.enterid,function(err,actors){
			if(!err){
				res.json(actors);
			}
		});
	});
}

//增加一个角色
exports.addActor = function(req,res){
	filter(req,res,function(){
		userapp.addActor(req,function(err){
			if(err){
				res.json({result:'failed',errMsg:'新增角色失败'});
			}else{
				res.json({result:'success'});
			}
		});
	});		
}

//删除一个角色
//备注：假设角色名称唯一
exports.delActor = function(req,res){
	filter(req,res,function(){
		
		actordao.delActor(req.session.enterid,req.param("actorname"),function(err){
			if(err){
				res.json({result:'failed',errMsg:'删除角色失败'});
			}else{
				res.json({result:'success'});
			}
		});
	});
}

//获取角色名称列表
exports.getActorList = function(req,res){
	filter(req,res,function(){
		userapp.getActorList(req.session.enterid,function(err,actors){
			if(!err){
				res.json(actors);
			}
		});
	});
}


//菜单项控制
exports.getMenus = function(req,res){
	filter(req,res,function(){
		
		var id = req.session.enterid;
		
		userapp.getMenusByEnterId(id,function(err,menus){
			if(!err){
				res.json(menus);
			}
		});
	});		
}

//获取制定用户所拥有的菜单项
exports.getMenusByUserName = function(req,res){
	filter(req,res,function(){
		var id = req.session.enterid;
		var username = req.session.username;
		
		userapp.getMenusByUserId(id,username,function(err,menus){
			if(!err){
				res.json(menus);
			}
		});	
	});
}

var upload = require("../pubapp/upload");

exports.uploadFile = function(req,res){
	filter(req,res,function(){
		upload.uploadFile(req,function(data){
	        if(data.success)
	            res.send(JSON.stringify(data), {'Content-Type': 'text/plain'}, 200);
	        else
	            res.send(JSON.stringify(data), {'Content-Type': 'text/plain'}, 404);
		});	
	})
}


//************************************************************************
var mbapp = require("../mbapp/mbapp");

//手机业务入口
exports.Mobile = function(req,res){
	res.sendfile('views/mb/start.html');
}

exports.mbLogin = function(req,res){
	res.sendfile('views/mb/login.html');
}

//手机用户登陆
exports.mbloginAction = function(req,res){	
	mbapp.mbLoginAction(req,function(err){	
		if(err){
			res.json({result:'failed',errMsg:'登陆失败'});
		}else{
			res.json({result:'success'});
		}
	});
}

exports.mbGetMsg = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/mb/msg.html');
	});
}

exports.mbGetApp = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/mb/app.html');
	});
}

exports.mbGetSetup = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/mb/setup.html');
	});
}

exports.mbGetAddress = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/mb/address.html');
	});
}

exports.getAddressList = function(req,res){
	
	var enterid = req.session.enterid;
	
	console.log('getAddressList:' + enterid);
	
	mbapp.getAdreesList(enterid,function(err,data){
		if(!err){
			res.json(data);
		}
	});
}

exports.getAddressDetail = function(req,res){
	var enterid = req.session.enterid;
	var name    = req.param("name");
	mbapp.getAddressDetail(enterid,name,function(err,data){
		if(!err){
			res.json(data);
		}
	});
}

//获取个人信息
exports.getPrivateDetail = function(req,res){
	mbapp.getPrivateDetail(req,function(err,data){
		if(!err){
			res.json(data);
		}
	});
}

//修改个人密码
exports.upPrivatePW = function(req,res){
	mbapp.upPrivatePW(req,function(err){
		if(err){
			res.json({result:'failed',Msg:'修改失败'});
		}else{
			res.json({result:'success',Msg:'修改成功'});
		}
	});
}

/*-*********************************************************************************
 * 系统服务路由
 */
exports.getSession = function(req,res){
	filter(req,res,function(){
		res.json({username:req.session.username});
	});
}

/*-
 * 报表统计
 */
exports.getReport = function(req,res){
	filter(req,res,function(){
		res.sendfile('views/pub/report.html');
	});
}


/*-**********************************************************************************
 * 系统测试路由
 */
var test = require("../test/test");

exports.testStub = function(req,res){
	test.testStub(function(){
		res.end("test OK");
	});
};

