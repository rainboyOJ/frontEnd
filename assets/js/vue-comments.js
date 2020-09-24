layui.define(['http','message'],function(exports){

  exports('vue-comments',{
    name:"comments",
    component:{
      data: function () {
        return {
          count: 0,
          content:"",
          total_replies:0,
          pagenation:{list:[],pageCount:0,pageSize:0,page:0},
          replies:[]
        }
      },
      props:["tid","self_uid"],
      methods:{
        reply(){ //评论
          if( this.content.length < 4 || this.content.length > 1000){
            layui.message.alert("评论长度太短,长度至少为4")
            return 
          }

          layui.http.reply_create({
              content:this.content,
              tid: this.tid
          }).then( data=>{
            layui.layer.msg(data.message)
            console.log(data)
            this.replies.unshift(data.doc)
          })

        },
        praise(e){  //给reply点赞
          let rid = $(e.srcElement).attr("rid")
          return layui.http.reply_thumbs_up({rid}).then( data=>{
            layui.layer.msg(data.message)
            if( data.up ){ //点赞成功
              let  num = $(e.srcElement).next().text()
              num++;
              $(e.srcElement).next().text(num)
            }
          })
        },
        getReply(page){
          return layui.http.reply_list(this.tid,page).then((data)=>{
            console.log(data)
            this.replies = data.replies
            this.total_replies = data.total_replies
            this.pagenation = data.pagenation
          })
        }
      },
      updated(){
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      },
      mounted(){
        this.getReply(1)
      },
      template: `
<div class="comments">
    <div class="comments-count">{{total_replies}} 回复</div>
    <div class="comments-list" v-for="(item,index) in replies">
        <div class="comments-header">
            <div class="avatar">
                <div class="tooltip__initiator">
                    <div class="icon-cell">
                        <div class="iconmedium">
                            <ins :style="{'background-image':'url('+item.uid.avatar+')'}"></ins>
                            <del></del>
                            <a :href="'/userinfo/'+(item.uid._id.toString() == self_uid ? '' :item.uid._id)"></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="userinfo">
                <a  class="war3-link war3-blue-link" :href="'/userinfo/'+(item.uid._id.toString() == self_uid ? '' :item.uid._id) ">{{item.uid.realname}}</a>
                <span class="reply-floor">{{index+1+(pagenation.page-1)*pagenation.pageSize}}楼</span>
                <span class="reply-time before-dot">{{item.update_at_ago}}</span>
            </div>
            <div class="user-action">
                <i v-on:click="praise($event)" :rid="item._id" class="layui-icon layui-icon-praise"></i>
                <span >{{item.ups.length}}</span>
            </div>
        </div>
        <div class="comments-body">
            <div class="markdown-body" v-html="item.html_content"></div>
        </div>
    </div>
    <div class="comments-pagenation">
        <div class="pagenation">
            <a id="page_prev"> <i class="layui-icon layui-icon-prev"></i> </a>
              <a :class="{active: item == pagenation.page}" v-on:click="getReply(item)" v-for="item in pagenation.list">{{item}}</a>
            <a id="page_next"> <i class="layui-icon layui-icon-next"></i> </a>
        </div>
    </div>

<div class="comments-post subCode">
    <codemirror v-model="content" 
                v-bind:config = '{
                mode: "text/x-markdown", 
                       lineNumbers: true,	//显示行号
                       theme: "blackboard",	//设置主题
                               lineWrapping: true,	//代码折叠
                               foldGutter: true,
                               matchBrackets: true,	//括号匹配
                               }'
                ></codemirror>
    <a class="war3-link war3-blue-link extra-info" href="https://rainboy.gitee.io/markdown-r-online/" target="_blank">支持markdown语法</a>
    <div class="comments-post-button">
        <button class="war3Button war3-blue-button btn-margin-top" v-on:click="reply">
            <span class="layui-icon layui-icon-edit"></span>
            评论
        </button>
    </div>
</div>

</div>
      `
    }
  })
})
