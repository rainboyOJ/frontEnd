// 进行网格请求的库
layui.define(['loading','message'], function(exports){
  const change_captcha = function(svg){
    //console.log(svg)
    //console.log($("#captcha")[0])
    $("#captcha").attr("src",`data:image/svg+xml;base64,${btoa(svg)}`)
  }

  //https://juejin.im/post/6844903891872514056
  const instance = axios.create({    //创建axios实例，在这里可以设置请求的默认配置
    timeout: 10000, // 设置超时时间10s
    baseURL: '/'   //根据自己配置的反向代理去设置不同环境的baeUrl
  })
  // 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
  instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

  let httpCode = {        //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
    400: '请求参数错误',
    401: '权限不足, 请重新登录',
    403: '服务器拒绝本次访问',
    404: '请求资源未找到',
    500: '内部服务器错误',
    501: '服务器不支持该请求中使用的方法',
    502: '网关错误',
    504: '网关超时'
  }

  /** 添加请求拦截器 **/
  instance.interceptors.request.use(config => {
    layui.loading(true)// 发起请求时加载全局loading，请求失败或有响应时会关闭

    //if (config.method === 'get') { // 添加时间戳参数，防止浏览器（IE）对get请求的缓存
    //config.params = {
    //...config.params,
    //t: new Date().getTime()
    //}
    //}
    //// 在这里：可以根据业务需求可以在发送请求之前做些什么:例如我这个是导出文件的接口，因为返回的是二进制流，所以需要设置请求响应类型为blob，就可以在此处设置。
    //if (config.url.includes('pur/contract/export')) {
    //config.headers['responseType'] = 'blob'
    //}
    //// 我这里是文件上传，发送的是二进制流，所以需要设置请求头的'Content-Type'
    //if (config.url.includes('pur/contract/upload')) {
    //config.headers['Content-Type'] = 'multipart/form-data'
    //}
    return config
  }, error=> {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

  /** 添加响应拦截器  **/
  instance.interceptors.response.use(response => {
    layui.loading(false)

    //console.log("response.data->",response.data)
    //console.log("response.data->",JSON.stringify(response,null,4))
    if (response.data.status === 0 ) {     // 响应结果里的status: 0是我与后台的约定，大家可以根据实际情况去做对应的判断
      return Promise.resolve(response.data)
    } 
    else if(response.data.status === "redirect") window.location= response.data.url || '/login'//redirect跳转
    else {
      layui.message.alert(response.data.message || '发生未知错误')
      if(response.data.captcha) change_captcha(response.data.captcha) //发生错误,尝试修改captcha
      console.error(response.data)
      return Promise.reject(response.data.message)
    }
  }, error => {
      layui.loading(false)
      console.log(error.response)
      if (error.response) {     
        // 根据请求失败的http状态码去给用户相应的提示
        let tips = error.response.data.message || ( error.response.status in httpCode ? httpCode[error.response.status] : "末知错误!")
        layui.message.alert(tips)
        return Promise.reject(error)
      } else {
        layui.message.alert("请求超时, 请刷新重试")
        return Promise.reject(new Error('请求超时, 请刷新重试'))
      }
  })

  /* 统一封装get请求 */
  const get = (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
      instance({
        method: 'get',
        url,
        params,
        ...config
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /* 统一封装post请求  */
  const post = (url, data, config = {}) => {
    //console.log("->",data)
    return new Promise((resolve, reject) => {
      instance({
        method: 'post',
        url,
        data,
        ...config
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
  //======================================================================

  //================= 各个请求的API
  //管理员登录
  const admin_login = data=>{ return post('/admin/login',data) }
  //创建邀请码
  const admin_invitecode_create = data => { return post('/admin/invitecode/create',data) }
  const admin_problem_create = (data,file)=> {
        let formData = new FormData();
        for (let key in data) formData.append(key, data[key]);
        //文件存在
        if(file) formData.append('file', file, file.name) 
        return post('/admin/problem/create',formData)
  }

  //用户注册
  const user_register = data => post('/register',data)
  //用户登录
  const user_login    = data => post('/login',data)

  const change_userinfo = data => post('/userinfo/change',data)

  //problem 发送评测数据
  const problem_judge = data => post('/problem/judge',data)

  //problem 查找
  const problem_search = data => post('/problem_search',data)

  //判断评测是否结束
  const isJudgeEnd = data => post('/is-judge-end',data)


  exports('http', {get,post,
    admin_login,
    admin_invitecode_create,
    admin_problem_create,
    user_register,
    user_login,
    problem_judge,
    isJudgeEnd,
    change_userinfo,
    problem_search
  });
});
