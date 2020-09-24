//依赖vue
const comments = new Vue({
  el: '#comments',
  data: {
    comments:[]     //评论
  },
  methods:{
    getReplay:function(_id,page){
    },
    createReply:function(){
    }
  },
  mounted:function(){ //挂载后 求page=1
    layui.use()
  }
})
