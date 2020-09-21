
layui.use('http',function(){
  const http = layui.http

  function Problem_Search(search){
    return http.problem_search({search}).then( d =>{
      console.log(d)
    })
  }

  function DEBOUNCE(t,ms = 0){
    var TIMEOUT_FLAG;
    return function (search) {
      clearTimeout(TIMEOUT_FLAG);
      if(search.length == 0) return
      TIMEOUT_FLAG = setTimeout(()=>{
        Problem_Search(search)
      },1000)
    }
  }

  let debounce = DEBOUNCE()
  $('#problem-search-and-jump').on("input", function(event) {
    debounce(this.value)
  })
})
