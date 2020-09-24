layui.define([],function(exports){

  exports('vue-codemirror',{
    name:"codemirror",
    component:{
      data: function () {
        return {
          editor:null
        }
      },
      props: ['value','config'],
      mounted:function(){
        this.editor = CodeMirror.fromTextArea(this.$refs.myeditor,this.config)
        this.editor.on('change',(cm)=>{
          this.$emit('input',cm.getValue())
        })
      },
      template: '<textarea ref="myeditor" class="codemirrorClass" v-model="value"></textarea>'
    }
  })
})
