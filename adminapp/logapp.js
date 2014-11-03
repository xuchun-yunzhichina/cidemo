/*! 
 * 日志管理业务操作
 * @author Fredric 
 * @date 2014-10-24
 */
var lineReader = require('line-reader');


exports.logHandler = function(req,callback){
	
	var loginfo = [];
	var Line = new Array();
	lineReader.eachLine('log/oa.log', function(line) {
	  	var Line =line.split("]");
		loginfo.push({time:Line[0],leve:Line[1],info:Line[2]});
	}).then(function () {
		callback(null,loginfo)
	});
}