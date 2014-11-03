/*! 
 * 棉花糖 用户管理、权限管理业务逻辑
 * @author Fredric 
 * @date 2014-10-14
 */
var memusdao = require("../pubdao/menu");
var actordao = require("../pubdao/actor");
var userdao  = require("../pubdao/user");
var tenantdao = require("../admindao/tenant");
var async     = require('async');

/*-
 * 根据企业ID，获取当前菜单栏作为权限项目
 * @id:企业ID
 * @callback:回调函数
 */
exports.getMenusByEnterId = function(id,callback){
	memusdao.getMenu(id,function(err,menus){
		if(err){
			return callback(err,null);
		}else{			
			return callback(err,format4EasyUI(menus));
		}
	});
}

/*-
 * 根据easyUI要求适配返回JSON数据格式，如下：
 * [{
	"id":1,
	"text":"My Documents",
	"children":[{
		"id":11,
		"text":"Photos",
		"state":"closed",
		"children":[{
			"id":111,
			"text":"Friend"
		},{
			"id":112,
			"text":"Wife"
		}]
	}]
}]
 * @ori:本地数据库JSON格式
 * @return :easyui前端tree空间JSON数据格式，如上所示
 * 备注：当前只支持到两层菜单
 */
function format4EasyUI(ori){
	var tarArray = new Array();
	
	var tar = {};
	tar.id = 1;
	tar.text = "菜单列表"
	if(0 != ori.length){
		tar.children = new Array();
		
		for(var i = 0; i < ori.length; i++){
			//添加一级目录
			
			var tmp1  = {};
			tmp1.id   = 1 + ori[i].menuid;
			tmp1.text = ori[i].menuname;
			
			//当前菜单目录权限暂时保持一级目录
			/*if(0 != ori[i].submenu.length){
				
				tmp1.children = new Array();
				
							
				for(var j = 0; j < ori[i].submenu.length;j++){
					tmp1.children.push(
							{"id" : 1 + ori[i].submenu[j].menuid,
							"text": ori[i].submenu[j].menuname});
				}
			}*/
			tar.children.push(tmp1);
		}
	}
	tarArray.push(tar);
	
	//console.log(JSON.stringify(tar));
	var result = JSON.stringify(tarArray);
	
	return  eval('(' + result + ')');
}



/*-
 * 增加一个角色
 */
exports.addActor = function(req,callback){
	
	var actor = {};
	var enterid = req.session.enterid;
	var menus    = eval(req.param("menus"));
		
	actor.actorname = req.param("actorname");
	actor.note      = req.param("note");
	actor.menu      = new Array();
	
	for(var i = 0; i < menus.length; i++){
		actor.menu.push({"id":menus[i].id,"text":menus[i].text});
	}
	
	actordao.addActor(enterid,actor,function(err){
		return callback(err);
	});		
}

//获取actor列表
exports.getActor = function(ID,callback){
	
	actordao.getActor(ID,function(err,actors){
		
		var output = new Array();	
		
		if(err){
			return callback(err,null);
		}else{
			//格式调整，保证前端表格中能够显示多部门
			for(var i = 0; i < actors.length; i++){
				var node   = {};
				node.actorname = actors[i].actorname;
				node.note      = actors[i].note;
				var tmp = "";
				
				for(var j = 0; j < actors[i].menu.length; j++){
					tmp += actors[i].menu[j].text;
					if(actors[i].menu.length -1 != j){
						tmp += ","
					}				
				}
				
				node.menu = tmp;
				output[i] = node;
			}
			
			return callback(err,output);
		}
	});
}


/*-
 * 获取角色列表
 * 该函数主要是适配easyUI combo树空间json格式
 */
exports.getActorList = function(ID,callback){
	actordao.getActor(ID,function(err,actors){		
		if(err){
			return callback(err);
		}else{
			/*构造一颗列表树，如下
			 * [{"id":1,"text":"角色A"}，{"id":2,"text":"角色B"}]
			 */
			var data = new Array();
			
			for(var i = 0; i < actors.length; i++){
				var tmp = {};
				tmp.id   = i;
				tmp.text = actors[i].actorname;
				data.push(tmp);
			}
								
			return  callback(null,data);
		}
	});
}

/*-
 * 添加一个用户
 */
exports.addUser = function(res,callback){
	var user = {};
	var tmp  = new Array();
	
	
	user.username = res.param("username");
	user.password = res.param("password");
	user.note     = res.param("note");
	user.actor    = new Array();
	
	tmp           = eval(res.param("actors"));
	
	for(var i = 0; i < tmp.length; i++){
		user.actor.push({"actorname":tmp[i].text});
	}
		
	userdao.addEnterUser(res.session.enterid,user,function(err){
		
		if(err){
			return callback(err);
		}else{
			//在租户库中增加该用户
			var data = new Array();
			data.push({'username':user.username,'password':user.password});
						
			tenantdao.addTenantUser(res.session.enterid,data,function(err){
				return callback(err);
			});
		}

	});		
}

exports.formatUser = function(ori,callback){
	var data = new Array();
	
	for(var i = 0; i < ori.length; i++){
		var node = {};
		
		node.username = ori[i].username;
		node.password = ori[i].password;
		node.note     = ori[i].note;
		
		var tmp = "";
		
		for(var j = 0; j < ori[i].actor.length;j++){
			tmp += ori[i].actor[j].actorname;
			
			if(ori[i].actor.length -1 != j){
				tmp += ","
			}			
		}
		node.actor     = tmp;
		
		data.push(node);	
	}
	
	return callback(data);
}


/*-
 * 根据企业ID和用户ID，获取该用户所具备权限的菜单栏
 * @id:企业ID
 * @username:用户名
 * @callback:回调函数
 * 
 * 前端插件格式如下
 * 	var menus = {
            "menus":[
			           {"menuid":"1","icon":"icon-role","menuname":"通讯录管理",
				      "menus":[
						{"menuid":"11","menuname":"部门管理","icon":"icon-log","url":"/dept"},
						{"menuid":"12","menuname":"员工管理","icon":"icon-log","url":"/employee"},
						{"menuid":"13","menuname":"报表统计","icon":"icon-log","url":"/report"},
					    ]},
						{"menuid":"2","icon":"icon-set","menuname":"系统配置",
				      "menus":[
						{"menuid":"21","menuname":"用户管理","icon":"icon-log","url":"/enteruser"},
						{"menuid":"22","menuname":"权限管理","icon":"icon-log","url":"/enteractor"}]}
	]};
 * 
 * 
 * 
 */
exports.getMenusByUserId = function(id,username,callback){
	
	var menus = {
            "menus":[
			           {"menuid":"1","icon":"icon-role","menuname":"通讯录管理",
				      "menus":[
						{"menuid":"11","menuname":"部门管理","icon":"icon-log","url":"/dept"},
						{"menuid":"12","menuname":"员工管理","icon":"icon-log","url":"/employee"},
						{"menuid":"13","menuname":"报表统计","icon":"icon-log","url":"/report"},
					    ]},
						{"menuid":"2","icon":"icon-set","menuname":"系统配置",
				      "menus":[
						{"menuid":"21","menuname":"用户管理","icon":"icon-log","url":"/enteruser"},
						{"menuid":"22","menuname":"权限管理","icon":"icon-log","url":"/enteractor"}]}
	]};//TBD
	
	//获取当前用户的权限
	userdao.getUser(id,{"username":username},function(err,users){
		if(err || 1 != users.length){
			return callback(err);
		}else{
			
			var list = new Array(); //该用户所具备全部权限的菜单项
			async.map(users[0].actor,
			
			function(input,callback){
				actordao.getActorByName(id,input.actorname,function(err,actor){
					for(var i = 0; i < actor.menu.length; i++){
						list.push(actor.menu[i].id);
					}
					return callback(err);
				});				
			},function(err,results){
				
				var _menus = {};
				_menus.menus = new Array();
				
				if(true == isInActor('11',list)){
					_menus.menus.push({"menuid":"1","icon":"icon-role","menuname":"通讯录管理",
				      "menus":[
						{"menuid":"11","menuname":"部门管理","icon":"icon-log","url":"/dept"},
						{"menuid":"12","menuname":"员工管理","icon":"icon-log","url":"/employee"},
						{"menuid":"13","menuname":"报表统计","icon":"icon-log","url":"/report"},
					    ]});
				}
				
				if(true == isInActor('12',list)){
					_menus.menus.push({"menuid":"2","icon":"icon-set","menuname":"系统配置",
					      "menus":[
					{"menuid":"21","menuname":"用户管理","icon":"icon-log","url":"/enteruser"},
					{"menuid":"22","menuname":"权限管理","icon":"icon-log","url":"/enteractor"}]});
				}
				
				return callback(null,_menus);
							
			});
		}
	});
}

function isInActor(menus,list){
	for(var i = 0; i < list.length; i++){
		if(menus == list[i]){
			return true;
		}
	}
	
	return false;
}


