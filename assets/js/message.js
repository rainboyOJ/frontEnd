layui.define(['layer'],function(exports){
  var layer = layui.layer

  //提示信息
  const alert= function(content){
    layer.alert(content, {
      skin: 'layui-layer-lan'
      ,closeBtn: 0
    });
  }

  exports('message',{alert})
})
