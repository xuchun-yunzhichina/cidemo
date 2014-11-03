window.onload=function(){
	// section_a  a#more_dowm
    var aBtn_moredown=document.getElementById("more_dowm");
    // var screenh=document.documentElement.clientHeight || document.body.clientHeight;
    // aBtn_moredown.style.top=screenh-aBtn_moredown.offsetHeight+"px";
    // window.onscroll=function(){
    //     var scrolltop=document.documentElement.scrollTop || document.body.scrollTop;
    //     aBtn_moredown.style.top=screenh-aBtn_moredown.offsetHeight+scrolltop+"px";
    // }
    aBtn_moredown.onclick=function(){
        document.documentElement.scrollTop=document.body.scrollTop=600;
    }

    // section_b
    var oSec_b=document.getElementById('isection_b');
    var aLink=oSec_b.getElementsByTagName('a');
    var aFun_box=oSec_b.getElementsByTagName('li');
    var aImg=oSec_b.getElementsByTagName('img');
    var i=0;
    aFun_box[0].style.display='block';
    aFun_box[0].style.left='0';
    for(i=0;i<aLink.length;i++){
        aLink[i].index=i;
        var iCur_index=0;
        aLink[i].onclick=function(){
            if(iCur_index!=this.index){
                for(i=0;i<aLink.length;i++){                                           
                    aFun_box[i].style.display='none';
                    aFun_box[i].style.left='1000px';
                }
                var j=this.index+1;        
                aFun_box[this.index].style.display='block';
                startMove(aFun_box[this.index],{'left':'0'});    
            }
            iCur_index=this.index;           
        }
        aLink[i].onmouseover=function(){
            var j=this.index+1;        
            aImg[this.index].src='images/canvas_c'+j+'.png';
            if(aImg[this.index].style.top=='35px'){
                aImg[this.index].style.top='-80px';
            }
            startMove(aImg[this.index],{'top':'35'});
        }
        aLink[i].onmouseout=function(){
            for(i=0;i<aLink.length;i++){
                var j=i+1;
                aImg[i].src='images/canvas'+j+'.png';
            }
        }
    }


    // section_c
    var oSec_c=document.getElementById('tab');
    var aLi=oSec_c.getElementsByTagName('li');
    var aDiv=oSec_c.getElementsByTagName('div');
    var num=0;
    // var timer=null;
    for(var i=0; i<aLi.length; i++){ 
        aLi[i].index=i;
        aLi[i].onclick=function(){
            num=this.index;
            tab();
        }
    }
    function tab(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].className='';
            aDiv[i].style.display='none';
        }
        aLi[num].className='active';
        aDiv[num].style.display='block';        
    }

	// modal_dialogue_box
    var oMask=document.getElementById('mask');
    var aLogin=document.getElementById('Login');
    var oLogin_box=document.getElementById('Login_box');
    var oLogin_close=document.getElementById('Login_close');
	var aRegister=document.getElementById('Register');
    var oRegister_box=document.getElementById('Register_box');
    var oRegister_close=document.getElementById('Register_close'); 
	var oIwantToo=document.getElementById('IwantToo'); 
    oLogin_close.onclick=function() {      
        oMask.style.display='none';
        oLogin_box.style.display='none';        
    }
    oRegister_close.onclick=function() {      
        oMask.style.display='none';
        oRegister_box.style.display='none';        
    }     
    aLogin.onclick=function() {       
        var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft=document.documentElement.scrollLeft || document.body.scrollLeft;
        //遮罩层
        oMask.style.display='block';  
        oMask.style.width=Math.max(document.body.offsetWidth,document.documentElement.clientWidth )+'px';
        oMask.style.height=Math.max(document.body.offsetHeight,document.documentElement.clientHeight )+'px';       
        //弹出层
		oRegister_box.style.display='none';
        oLogin_box.style.display='block';
        oLogin_box.style.left=(document.documentElement.clientWidth-oLogin_box.offsetWidth )/2+scrollLeft+'px';
        oLogin_box.style.top=(document.documentElement.clientHeight-oLogin_box.offsetHeight )/2+scrollTop+'px';
    }
	oIwantToo.onclick=aRegister.onclick=function() {       
        var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft=document.documentElement.scrollLeft || document.body.scrollLeft;
        //遮罩层
        oMask.style.display='block';  
        oMask.style.width=Math.max(document.body.offsetWidth,document.documentElement.clientWidth )+'px';
        oMask.style.height=Math.max(document.body.offsetHeight,document.documentElement.clientHeight )+'px';       
        //弹出层
		oLogin_box.style.display='none';
        oRegister_box.style.display='block';
        oRegister_box.style.left=(document.documentElement.clientWidth-oRegister_box.offsetWidth )/2+scrollLeft+'px';
        oRegister_box.style.top=(document.documentElement.clientHeight-oRegister_box.offsetHeight )/2+scrollTop+'px';
    }    
    window.onscroll=function() {       
        if(oLogin_box.style.display=='none') return;       
        var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft=document.documentElement.scrollLeft || document.body.scrollLeft;        
        oLogin_box.style.left=(document.documentElement.clientWidth-oLogin_box.offsetWidth )/2+scrollLeft+'px';
        oLogin_box.style.top=(document.documentElement.clientHeight-oLogin_box.offsetHeight )/2+scrollTop+'px';
		oRegister_box.style.left=(document.documentElement.clientWidth-oRegister_box.offsetWidth )/2+scrollLeft+'px';
        oRegister_box.style.top=(document.documentElement.clientHeight-oRegister_box.offsetHeight )/2+scrollTop+'px';    }
    
    window.onresize=function() {     
        if (oMask.style.display == 'none') return ;       
        oMask.style.width=Math.max(document.body.offsetWidth,document.documentElement.clientWidth )+'px';
        oMask.style.height=Math.max(document.body.offsetHeight,document.documentElement.clientHeight )+'px';        
        if (oLogin_box.style.display == 'none') return ;        
        var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft=document.documentElement.scrollLeft || document.body.scrollLeft;        
        oLogin_box.style.left=(document.documentElement.clientWidth-oLogin_box.offsetWidth)/2+scrollLeft+'px';
        oLogin_box.style.top=(document.documentElement.clientHeight-oLogin_box.offsetHeight )/2+scrollTop+'px';
		if (oRegister_box.style.display == 'none') return ;        
        var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft=document.documentElement.scrollLeft || document.body.scrollLeft;        
        oRegister_box.style.left=(document.documentElement.clientWidth-oRegister_box.offsetWidth)/2+scrollLeft+'px';
        oRegister_box.style.top=(document.documentElement.clientHeight-oRegister_box.offsetHeight )/2+scrollTop+'px';       
    }
	
	//input
	var ins=document.getElementById('login_form').getElementsByTagName('input')[0];
	ins.style.color="#999";
	ins.onfocus=function(){
		clearval(ins,"请输入用户名");
	}
	ins.onblur=function(){
		resetval(ins,"请输入用户名");
	}
	function clearval(inputObj,val){ 
		if(inputObj.value==val){ 
			inputObj.value=""; 
			inputObj.style.color="#000";
		} 
	} 
	function resetval(inputObj,val){ 
		if(inputObj.value==""){ 
			inputObj.value=val; 
			inputObj.style.color="#999";
		} 
	} 
}











