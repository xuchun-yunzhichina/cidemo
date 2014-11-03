/*! 
 * 棉花糖 菜单dao封装（作为权限项）
 * @author Fredric 
 * @date 2014-10-17
 */

var db = require('../util/dbmanager');
var set = require('../util/hashmap');
var mongoose = db.mhtdb().mongoose;
var Schema   = db.mhtdb().Schema;


//企业租户管理界面菜单，作为权限管理项
/*-
 * 菜单ID命名规则如下：
 * 一级菜单为：1、2、3
 * 二级菜单为：11,12,13 或 21,22,23
 */
var enterMenu = new Schema({
	menuid: 	{type:String}, 		//菜单索引ID
	menuname: 	{type:String}, 		//菜单名称
	menuicon:   {type:String},
	menuurl :	{type:String},  	//对应的连接地址
	submenu :[{ //二级子菜单
	          menuid: 	{type:String}, 		//菜单索引ID
	          menuname: {type:String}, 	//菜单名称
	          menuicon: {type:String},  
	          menuurl :	{type:String}  		//对应的连接地址         
	}]
});

var modelmap = new set.hashmap();

function getModel(ID){
	if(null != modelmap.get(ID)){
		return modelmap.get(ID);
	}else{
		var enterMenuModel = db.getEnterDb(ID).model('menuModel',enterMenu,'menu');
		modelmap.put(ID,enterMenuModel);
		return enterMenuModel;
	}	
}

/*-
 * 初始化菜单集合
 * 备注：版本1，菜单集合为
 * 一级菜单：通讯录管理
 * 		二级菜单：部门管理
 * 		二级菜单：员工管理
 * 		二级菜单：报表统计
 * 一级菜单：系统配置
 * 		二级菜单：用户管理
 * 		二级菜单：权限管理 
 */
//初始化通讯录管理菜单
exports.initAddressMenu = function(id,callback){
	var menu = new getModel(id)({
			menuid:"1",
			menuname:"通讯录管理",
			menuicon:"icon-role",
			menuurl:null,
			submenu:[
			    {
			    	menuid:"11",
			    	menuname:"部门管理",
			    	menuicon:"icon-log",
			    	menuurl:"/dept",
			    	submenu:null
			    },
			    {
			    	menuid:"12",
			    	menuname:"员工管理",
			    	menuicon:"icon-log",
			    	menuurl:"/employee",
			    	submenu:null
			    },
			    {
			    	menuid:"13",
			    	menuname:"报表统计",
			    	menuicon:"icon-log",
			    	menuurl:"/report",
			    	submenu:null
			    }]
	});//var menu = new getModel(id)({
	
	menu.save(function(err){
		return callback(err);
	});	
}

//初始化系统配置菜单
exports.initSysMenu = function(id,callback){
	var menu = new getModel(id)({
		menuid:"2",
		menuname:"系统管理",
		menuicon:"icon-set",
		menuurl:null,
		submenu:[
		    {
		    	menuid:"21",
		    	menuname:"用户管理",
		    	menuicon:"icon-log",
		    	menuurl:"/enteruser",
		    	submenu:null
		    	
		    },
		    {
		    	menuid:"22",
		    	menuname:"角色管理",
		    	menuicon:"icon-log",
		    	menuurl:"/enteractor",
		    	submenu:null
		    }]
	});//var menu = new getModel(id)({
	
	menu.save(function(err){
		return callback(err);
	});	
}

/*-
 * 向租户数据库添加菜单项
 * @ID：企业租户ID
 * @menu：菜单项
 * @callback:回调函数
 */
exports.addMenu = function(ID,menu,callback){
	var entity = new getModel(ID)({		
		menuid:menu.menuid,
		menuname:menu.menuname,
		menuurl:menu.menurl,
		submenu:menu.submenu
	});
	
	menu.save(function(err){
		return callback(err);
	});
}

/*-
 * 获取某租户企业的菜单项列表
 */
exports.getMenu = function(ID,callback){
	getModel(ID).find({},function(err,menus){
		return callback(err,menus);
	});
}


