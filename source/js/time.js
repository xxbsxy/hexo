var now = new Date(); 
function createtime() { 
    var grt= new Date("05/09/2023 15:00:00");//在此处修改你的建站时间，格式：月/日/年 时:分:秒
    now.setTime(now.getTime()+250); 
    days = (now - grt ) / 1000 / 60 / 60 / 24; dnum = Math.floor(days); 
    hours = (now - grt ) / 1000 / 60 / 60 - (24 * dnum); hnum = Math.floor(hours); 
    if(String(hnum).length ==1 ){hnum = "0" + hnum;} minutes = (now - grt ) / 1000 /60 - (24 * 60 * dnum) - (60 * hnum); 
    mnum = Math.floor(minutes); if(String(mnum).length ==1 ){mnum = "0" + mnum;} 
    seconds = (now - grt ) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum); 
    snum = Math.round(seconds); if(String(snum).length ==1 ){snum = "0" + snum;} 
    document.getElementById("timeDate").innerHTML = "已经在星海中遨游了 "+dnum+" 天 " + hnum + " 小时 " + mnum + " 分 " + snum + " 秒"; 
} 
setInterval("createtime()",250);

// Hexo 注入代码
hexo.extend.injector.register('head_begin', '<link rel="stylesheet" href="https://fastly.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/css/all.min.css">', 'default');
// Fluid 注入代码
hexo.extend.filter.register('theme_inject', function(injects) {
    injects.head.raw('default', '<script src="https://username.github.io/live2d-widget/autoload.js"></script>');
});