/*! 
 * 备份业务操作
 * @author Fredric 
 * @date 2014-10-24
 */

var child_process = require('child_process')

var syslogdao = require("../admindao/syslogdao");


exports.backupHandler = function(req,callback){
	var username = req.session.username;
	

	
	child_process.execFile('start.bat', [1, 2], {cwd:'E:/backup'}, function(err, stdout, stderr) {
		
		var myDate = new Date();
		mytime = myDate.toLocaleDateString() + "  " + myDate.toLocaleTimeString();
		
		if(!err){
			syslogdao.addBackupLog(username, mytime, [{"dbname":"mhtadmin"}],function(err){
			
				return callback(err);
			});
		}	
	});
}


exports.formatBackupLog = function(logs){
	var data = new Array();
	
	for(var i = 0; i < logs.length; i++){
		var node = {};
		node.name 	= logs[i].name;
		node.time 	= logs[i].time;
		node.database = "";
		
		for(var j = 0; j < logs[i].database.length; j++){
			node.database += logs[i].database[j].dbname;
			node.database +=";";
		}
		
		data.push(node);
	}
	
	return data;
}
