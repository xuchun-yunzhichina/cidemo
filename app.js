
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var db   = require('./util/dbmanager');
var log  = require('./util/log');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
log.use(app);

app.use(express.cookieParser(''));
app.use(express.session({
    secret: 'secret-id',
    store: new MongoStore({
    	db: 'mhtadmin'
})
}));

app.use(routes);
app.use(express.bodyParser());
app.use(express.methodOverride());


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));


// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}


/*-**************************************************************************************
 * 管理员访问入口
 */

//登陆
app.get('/login', routes.adminLogin);
app.get('/logout', routes.adminlogout);
app.post('/loginaction',routes.loginAction);
app.get('/adminindex',routes.adminIndex);

//用户管理
app.get('/adminuser', routes.adminUser);
app.post('/getadminuser', routes.getAdminUser);
app.post('/addadminuser',routes.addAdminUser);
app.post('/updateadminuser',routes.updateAdminUser);
app.post('/deladminuser',routes.delAdminUser);

//个人设置
app.get('/adminperson',routes.adminPerson);
app.get('/updatepw',routes.updatePw);

//企业租户管理
app.get('/admintenant',routes.adminTanent);
app.post('/gettenant',routes.getTenant);
app.post('/addtenant',routes.addTenant);
app.post('/updatetenant',routes.updateTenant);
app.post('/deltenant',routes.delTenant);


app.post('/getloginfo',routes.getLogInfo);

//日志管理
app.get('/adminlog',routes.adminLog);

//数据备份
app.get('/adminbackup',routes.adminBackUp);
app.post('/dobackup',routes.doBackup);
app.post('/getbackuplog',routes.getBackUpLog);

//报表统计
app.get('/adminreport',routes.getAdminReport);
app.get('/getadminreport1',routes.getAdminReport1);


/*-**************************************************************************************
 * 企业租户访问入口
 */
app.get('/',routes.login);
app.post('/publogin',routes.pubLogin);
app.post('/publogout',routes.pubLogout);


app.post('/register',routes.register);
app.get('/index',routes.index);
app.get('/dept',routes.dept);
app.get('/employee',routes.employee);

//部门管理入口
app.get('/getdeptinfo',routes.getDeptInfo);
app.post('/adddeptnode',routes.addDeptNode);
app.post('/deldeptnode',routes.delDeptNode);
app.post('/updeptnode',routes.upDeptNode);

//员工管理入口
app.get('/getemplyee',routes.getEmployee);
app.post('/getemployeeinfo',routes.getEmployeeInfo);
app.post('/getemployeedetail',routes.getEmployeeDetail);
app.post('/addemployee',routes.addEmployee);
app.post('/delemployee',routes.delEmployee);
app.get('/upemployee',routes.upEmployee);
app.post('/importdata',routes.importData);
app.get('/exportdata',routes.exportData);

//租户企业的用户管理
app.get('/enteruser',routes.enterUser);
app.post('/getuser',routes.getUser);
app.post('/adduser',routes.addUser);
app.post('/deluser',routes.delUser);

//租户企业权限管理
app.get('/enteractor',routes.enterActor);
app.post('/addactor',routes.addActor);
app.post('/getactor',routes.getActor);
app.post('/delactor',routes.delActor);

app.get('/getmenus',routes.getMenus);
app.get('/getmenusbyuser',routes.getMenusByUserName);
app.get('/getactorlist',routes.getActorList);

//报表统计
app.get('/report',routes.getReport);

//文件上传
app.post('/upload',routes.uploadFile);



/*-*****************************************************************************
 * 手机APP端访问路径
 */
app.get('/mobile', routes.Mobile);
app.get('/mblogin',routes.mbLogin);
app.post('/mbloginaction',routes.mbloginAction);

//APP 主导栏跳转
app.get('/mbmsg',routes.mbGetMsg);
app.get('/mbaddress',routes.mbGetAddress);
app.get('/mbapp',routes.mbGetApp);
app.get('/mbsetup',routes.mbGetSetup);

//Address 页面业务
app.post('/getaddresslist',routes.getAddressList);
app.post('/getaddressdetail',routes.getAddressDetail);

//个人设置业务
app.post('/getprivatedetail',routes.getPrivateDetail);
app.post('/upprivatepw',routes.upPrivatePW);


/*-**************************************************************************************
 * 外网服务访问入口，含公共webservice、mobile client
 */
app.get('/getsession',routes.getSession);


/*-**************************************************************************************
 * 系统测试打桩入口
 */
app.get('/teststub',routes.testStub);
app.get('/users', user.list);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
