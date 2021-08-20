// Loaded On Demand monitor inframe
$.get('/monitorCfg.js',function(data){
    console.log(data);
    data = JSON.parse(data)
    console.log(typeof data);
    
    if(data.length===0){return}
    var perfomanceMonitor = `<dl id="menu-monitor">
    <dt><i class="Hui-iconfont">&#xe6c1;</i> System Monitor<i class="Hui-iconfont menu_dropdown-arrow">&#xe6d5;</i>
    </dt>
    <dd>
        <ul id="monitor_submenu">

        </ul>
    </dd>
</dl>`
    $("#menunav_dropdown").append(perfomanceMonitor)
    for (item of data){
        console.log(item);
        $("#monitor_submenu").append(`<li><a data-href="${item.url}" data-title="${item.name}" href="javascript:void(0)">${item.name}</a></li>`)
    }
})