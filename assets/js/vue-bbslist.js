//\ 
/*
table = {
  head:[]
  body:{
    key:"",
    type:"",
    style:""
  }
}

tab [
{
  name:'全局',
  query:{
    tab,
    page,
    pageSize,
    uid,
    pid
  }
}
]

smallPagenation
*/
layui.define(['http','message'],function(exports){
  msg = layui.layer.msg

  exports('vue-bbslist',{
    name:"bbslist",
    component:{
      data: function () {
        return {
          nowName:'',
          data:[],
          topics:[],
          pagenation:{},
        }
      },
      props:["tab","showpagenation","self_uid","action"],
      methods:{
        change(idx){
          if( this.data[idx]){
            this.nowName = this.tab[idx].tabName
            this.topics= this.data[idx].topics
            this.pagenation= this.data[idx].pagenation
          }
          else {
            layui.http.bbs_list_api(this.tab[idx].query).then(data=>{
                this.nowName = this.tab[idx].tabName
                this.data[idx] = data
                this.topics= data.topics
                this.pagenation= data.pagenation
            })

          }
        },
        get_topics(item){
            let idx = 0
            if(this.tab[1].tabName == this.nowName) idx = 1
            layui.http.bbs_list_api({...this.tab[idx].query,page:item}).then(data=>{
                console.log(data)
                this.nowName = this.tab[idx].tabName
                this.data[idx] = data
                this.topics= data.topics
                this.pagenation= data.pagenation
            })
        }
      },
      updated(){},
      mounted(){
        this.data = Array(this.tab.length).fill(null)
        layui.http.bbs_list_api(this.tab[0].query).then(data=>{
          this.nowName = this.tab[0].tabName
          this.data[0] = data
          this.topics= data.topics
          this.pagenation= data.pagenation
        })
      },
      template: `
      <div>
        <div class="layui-tab layui-tab-brief" v-if="tab.length > 1">
          <ul class="layui-tab-title">
            <li v-on:click="change(index)" :class="!index ? 'layui-this' :'' " v-for="(item,index) in tab">{{item.tabName}}</li>
          </ul>
        </div>
        <div class="problemList">
          <table class="tableList">
            <thead>
              <tr>
                <th v-show="nowName=='题目'">题目</th>
                <th>标题</th>
                <th>最后回复</th>
                <th v-if="action">操作</th>
                <th v-if="action">删除</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in topics">
                <td v-show="nowName=='题目'">
                  <a :href="'/problem/' + (item.pid ? item.pid.pid :'')">
                    #{{item.pid ? item.pid.pid +' ' + item.pid.title : ''}}
                  </a>
                </td>
                <td>
                  <button class="war3-default-btn btn-blizzard" v-show="item.top">置顶</button>
                  <a :href="'/bbs/'+item._id">{{item.title}}</a>
                </td>
                <td>{{item.last_reply_at_human}}</td>
                <td v-if="action" style="width:100px;">
                  <a :href="'/bbs_update/'+ item._id" class="war3Button war3-default-btn btn-blizzard" style="color:#fff;">
                    编辑
                  </a>
                </td>
                <td v-if="action" style="width:48px;">
                    <span class="iconfont icon-duihao" v-show="item.is_del"></span>
                </td>
              </tr>
            </tbody>
          </table>

    <div class="comments-pagenation" v-if="showpagenation">
        <div class="pagenation">
            <a id="page_prev"> <i class="layui-icon layui-icon-prev"></i> </a>
              <a :class="{active: item == pagenation.page}" v-on:click="get_topics(item)" v-for="item in pagenation.list">{{item}}</a>
            <a id="page_next"> <i class="layui-icon layui-icon-next"></i> </a>
        </div>
    </div>

        </div>
      </div>
      `
    }
  })
})
