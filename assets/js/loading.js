layui.define(['layer'],function(exports){

  exports('loading',function (t){
    if (t) {//如果是true则显示loading
      loading = layer.load(0, {shade: false});
    } else {//如果是false则关闭loading
      layer.closeAll('loading');
    }
  })
})
