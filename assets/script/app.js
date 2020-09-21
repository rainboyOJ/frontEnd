
layui.use('http',function(){
  const http = layui.http

  function Problem_Search(search){
    return http.problem_search({search}).then( d =>{
      $("#search_result").show()
      $("#search_result_list").empty()
      if(d.problems.length ===0 )
          $("#search_result_list").append(`<li><a style="pointer-events: none;" href="#">没有找到题目</a></li>`)
      else
        for( let {pid,title} of d.problems){
          $("#search_result_list").append(`<li><a href="/problem/${pid}">${pid} ${title}</a></li>`)
        }

    })
  }

  function DEBOUNCE(t,ms = 0){
    var TIMEOUT_FLAG;
    return function (search) {
      clearTimeout(TIMEOUT_FLAG);
      if(search.length == 0) {
        $("#search_result").hide()
        return
      }
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
