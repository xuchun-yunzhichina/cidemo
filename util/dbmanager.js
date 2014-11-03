/*! 
 *  数据库管理公共接口
 * @author Fredric 
 * @date 2014-10-4
 */

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

//mhtadmin为OA平台管理员数据库
var admincon = mongoose.createConnection('mongodb://localhost/mhtadmin');

admincon.on('error', console.error.bind(console, 'mhtadmin 数据库连接失败'));
admincon.once('open', function callback () {console.log('mhtadmin 数据库连接成功');});


exports.mhtdb = function(){
	var mhtdb = new Object();
	mhtdb.mongoose = mongoose;
	mhtdb.Schema   = Schema;
	mhtdb.con      = admincon;
	
	return (mhtdb);
}

/*-
 * 初始化企业租户DB
 */
var enterConn = new Array();
var tenantdao = require("../admindao/tenant");
var logger    = require("../util/log").logger;

function initEnterConn(){

	//读取tenant信息
	tenantdao.findTenant({},function(err,tenants){
		if(!err){
			var count = 0;
			tenants.forEach(function(tenant){
				enterConn[count++] = mongoose.createConnection('mongodb://localhost/' + tenant.ID);
				
				logger.info(tenant.ID + 'db connected');
			});
		}
	})
}

initEnterConn();

//增加一个企业的连接，租户注册时
exports.addEnterDb = function(id){
	enterConn[enterConn.length] = mongoose.createConnection('mongodb://localhost/' + id);
}

//获取制定企业租户的连接
exports.getEnterDb = function(id){	
	for(var i = 0; i < enterConn.length;i++){
		if(id == enterConn[i].name){
			return enterConn[i];
		}
	}	
}



