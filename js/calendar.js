
/****************************************
 * 原生js日历插件(es6)
 * @author addfun
*****************************************/
;(()=>{

  class Calendar{
    constructor(dom){
      this.init(dom)
    }

    /**
     * 获取一个月日期数据的方法
     * @param {number} year 
     * @param {number} mouth 
     */
    getMouthData(year,mouth){
      //一个月的日期数据容器 
      let mouthDates = {}
      //如果没有传year或mouth 就拿当日的年月作为参数
      if(!year || !mouth){
        let today = new Date()
        year = today.getFullYear()
        mouth = today.getMonth() + 1//计算机的月份为0-11
      }
      mouthDates.year = year
      mouthDates.mouth = mouth
      
      //year年mouth月的第一天
      let firstDay = new Date(year,mouth-1,1)
      //year年mouth月的第一天的周几
      let firstWeekday = firstDay.getDay()

      //上一个月的最后一天（参数为0系统会默认传上一个月的最后一天）
      let lastDayOfLastMouth = new Date(year,mouth-1,0)
      //上一个月最后一天日期
      let lastDateOfLastMouth = lastDayOfLastMouth.getDate()

      //这个月最后一天（通过传入下个月的第0天来获取）
      let lastDay = new Date(year,mouth,0)
      //这个月最后一天的日期
      let lastDate = lastDay.getDate()
      //这个月最后一天的星期
      let lastWeekday = lastDay.getDay()

      //这个月应该展示日期的天数（包括上个月最后一周和下个月的第一周）
      let showMouthLength = firstWeekday + lastDate + 6-lastWeekday
      mouthDates.dates = []
      for(let i=0;i<showMouthLength;i++){
        let date, thatMouth
        if(i<firstWeekday){
          date = lastDateOfLastMouth - (firstWeekday - (i + 1))
          thatMouth = mouth - 1
        }else if(i<lastDate+firstWeekday){
          date = (i + 1) - firstWeekday
          thatMouth = mouth
        }else{
          date = (i + 1) - (lastDate + firstWeekday)
          thatMouth = mouth + 1
        }
        if(thatMouth>12) thatMouth = 1
        if(thatMouth<1) thatMouth = 12
        mouthDates.dates[i] = {
          date: date,
          mouth: thatMouth
        }
      }
      //将数据保存为实例属性
      this.mouthDates = mouthDates
    }

    //渲染这个月数据的方法
    renderMouth(){
      let mouthDates = this.mouthDates,
          curToday = new Date(),
          curDate = curToday.getDate(),
          curMouth = curToday.getMonth()+1,
          curYear = curToday.getFullYear(),
          year = mouthDates.year,
          mouth = mouthDates.mouth,
          $dom = this.$container
          let html = `<div class="calendar">
                        <div class="calendar-title clear-fix">
                          <div class="calendar-btn calendar-btn-left">&lt;</div>
                          <div class="calendar-btn calendar-btn-right">&gt;</div>
                          <div class="calendar-btn-center">${year}-${mouth}</div>
                        </div>
                        <table>
                          <thead>
                            <tr>
                              <th>日</th>
                              <th>一</th>
                              <th>二</th>
                              <th>三</th>
                              <th>四</th>
                              <th>五</th>
                              <th>六</th>
                            </tr>
                          </thead>
                          <tbody>`
      for(let i=0;i<mouthDates.dates.length;i++){
        if(i%7==0) html += '<tr>'
        if(mouthDates.dates[i].mouth === mouth){
          if(curYear == year && curMouth == mouth && curDate == mouthDates.dates[i].date){
            html += `<td class="today" data-date="${mouthDates.dates[i].date}">${mouthDates.dates[i].date}</td>`
          }else{
            html += `<td data-date="${mouthDates.dates[i].date}">${mouthDates.dates[i].date}</td>`
          }
        }else{
          html += `<td class="notThisMouth">${mouthDates.dates[i].date}</td>`
        }
        if(i%7==6) html += '</tr>'
      }
      html += '</tbody></table></div>'

      $dom.innerHTML = html;
    }

    //绑定事件
    bindEvent(){
      //为包裹元素绑定事件（事件委托）
      this.$container.addEventListener("click", e=>{
        let target = e.target
        if(target.classList.contains("calendar-btn-left")){
          this.changeMouth("prev")
        }else if(target.classList.contains("calendar-btn-right")){
          this.changeMouth("next")
        }else if(target.tagName == "TD"){
          let date = target.dataset.date
          target.classList.contains("active") ? target.classList.remove("active") : target.classList.add("active")
          date ? this.showDate(date) : ''
        }
      },false)
    }

    //月份的切换
    changeMouth(direction){
      let mouthDates = this.mouthDates,
          year = mouthDates.year,
          mouth = mouthDates.mouth,
          $dom = this.$container;
      if(direction === "prev"){
        if(mouth == 1){
          year -= 1
          mouth = 12
        }else{
          mouth -= 1
        }
      }
      if(direction === "next"){
        if(mouth == 12){
          year += 1
          mouth = 1
        }else{
          mouth += 1
        }
      }
      this.getMouthData(year, mouth)
      this.renderMouth($dom)
    }

    //点击展示月份日期时 console出点击的日期
    showDate(date){
      let mouthDates = this.mouthDates
      console.log(`${mouthDates.year}-${mouthDates.mouth}-${date}`)
    }

    //初始化函数
    init($dom){
      let $container
      if(typeof $dom == "string"){
        $container = document.querySelector($dom)
      }else{
        $container = $dom
      }
      if($container){
        this.$container = $container
      }else{
        throw new Error("请传入一个dom对象或#id、.class、tagName字符串")
      }
      this.getMouthData()
      this.renderMouth()
      this.bindEvent()
    }
  }

  window.Calendar = Calendar
})();