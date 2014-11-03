/*! 
 * 棉花糖 企业用户登陆注册
 * @author Fredric 
 * @date 2014-10-14
 */

var tenantdao = require("../admindao/tenant");
var logger    = require("../util/log").logger;
var tenant    = require("../admindao/tenant");
var db     	  = require("../util/dbmanager");
var userdao   = require("../pubdao/user");
var deptdao   = require("../pubdao/dept");
var menudao   = require("../pubdao/menu");
var actordao  = require("../pubdao/actor");
var async     = require('async');
var userapp   = require('../pubapp/userapp');

/*-
 * 处理企业租户注册主函数，完成功能流程如下：
 * 1、判断企业ID是否唯一，若唯一继续；
 * 2、根据企业ID在mongo中创建租户数据库，数据库名称为企业ID
 * 3、初始化该企业租户的管理员表，将该企业ID（手机号）作为超级管理员用户名；
 * 4、在系统库的tenant的集合中添加该用户
 * 5、初始化该企业租户部门列表
 * 6、初始化企业菜单列表
 * 7、在角色表中增加"系统管理员"，具备全部菜单权限
 * @req：http 请求，含注册信息；
 * @callback:回调函数
 */
exports.regHandler = function(req,callback){
	
	var newReg = {
			id			:req.body.ID,
			password	:req.body.firstpw,
			entername	:req.body.entername
	};
	
	logger.info("new tenant register:" + newReg);
	
	tenant.findTenant({ID:newReg.id},function(err,tenants){
		
	if(err){
		return callback(err);
	}
	
	//步骤1
	if(0 != tenants.length){
		return callback("failed","该用户已存在");
	}
	
	//串行执行业务流程
	async.series([
	
	//步骤2
	function(callback){
		//创建该企业租户的独立DB，DB名称为企业注册ID
		db.addEnterDb(newReg.id);
		callback(null,"DB success");
	},
	
	//步骤3
	function(callback){
		//添加企业超级管理员
		var info = {
				username:newReg.id,
			    password:newReg.password,
			    actor :[{"actorname":"系统管理员"}],
			    note:null
		};
		
		userdao.addEnterUser(newReg.id,info,function(){
			return callback(err,"数据添加错误");
		});		
	},
	
	//步骤4.1
	function(callback){
		tenantdao.addTenant(newReg.id,newReg.password,
				newReg.entername,function(){
			return callback(err,"数据添加错误");
		});	
	},
	
	//步骤4.2
	function(callback){
		var data = new Array();
		data.push({'username':newReg.id,'password':newReg.password});
		tenantdao.addTenantUser(newReg.id,data,function(){
			return callback(err,"数据添加错误");
		});	
	},
	
	//步骤5
	function(callback){
		deptdao.initDeptInfo(newReg.id,function(){
			return callback(err,"数据添加错误");
		});
	},
	
	//步骤6.1
	function(callback){
		menudao.initAddressMenu(newReg.id,function(){
			return callback(err,"数据添加错误");
		});	
	},
	
	//步骤6.2
	function(callback){
		menudao.initSysMenu(newReg.id,function(){
			return callback(err,"数据添加错误");
		});
	
	},
	
	//步骤7
	function(callback){
		
		menudao.getMenu(newReg.id,function(err,menus){
			if(!err){
				var newActor = {};
				newActor.actorname = '系统管理员';
				newActor.note = '企业租户系统管理员，具备全部系统权限';
				newActor.menu = new Array();
				
				for(var i = 0; i < menus[0].submenu.length; i++){
					newActor.menu.push({'id':menus[0].submenu[i].menuid
						,'text':menus[0].submenu[i].menuname});
				}
				
				actordao.addActor(newReg.id,newActor,function(){
					return callback(err,"数据添加错误");
				})
			}
		});		
	}],
	
	//回调函数
	function(err,results){		
			if(err){
				return callback("failed","数据添加错误"); //暂不区分错误类型
			}else{
				return callback(null,"success");
			}		
		});	
	});
}

