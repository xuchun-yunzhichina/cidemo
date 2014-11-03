/*! 
 * 棉花糖 管理员租户数据DAO封装
 * @author Fredric 
 * @date 2014-09-28
 */

var db = require('../util/dbmanager');
var mongoose = db.mhtdb().mongoose;
var Schema   = db.mhtdb().Schema;
var con      = db.mhtdb().con;

var backupSchema = new Schema({
	name:	{
        type: String  //执行操作人ID
    },
	time:   {         //执行时间
        type: String
    },
    database:[{       //备份的数据库
    	dbname:{type:String}, 
    }]
});

var backupModel = con.model('backupModel',backupSchema,'backuplog');

/*-
 * 添加一条数据备份记录
 */
exports.addBackupLog = function(name,time,dbs,callback){
	
	var entity = new backupModel({
		name:name,
		time:time,
		database:dbs,
	});
	
	console.log(entity);
	
	entity.save(function(err){
		return callback(err);
	});
}

/*-
 * 获取当前的数据备份记录
 */
exports.getBackupLog = function(option,callback){
	backupModel.find(option,function(err,logs){
		return callback(err,logs);
	});
}



