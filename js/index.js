// 取得url資訊
let urlCity,urlTheme,urlKeyword;
function getUrlDetail(){
  let info=location.href.split('?')[1]
  if(info){
    info=info.split('&&')
    urlCity=info[0].split('=')[1]
    urlTheme=info[1].split('=')[1]
    urlKeyword=info[2].split('=')[1]
  }
}
// 精選主題toggle效果
$(function(){
  $('.border-hover').on('click',function(){
    $(this).toggleClass('active');
    $(this).siblings().removeClass('active');
  })
})

// 渲染下拉選單
const city=[
  {chinese:"臺北",english:"Taipei"},
  {chinese:"新北",english:"NewTaipei"},
  {chinese:"桃園",english:"Taoyuan"},
  {chinese:"臺中",english:"Taichung"},
  {chinese:"臺南",english:"Tainan"},
  {chinese:"高雄",english:"Kaohsiung"},
  {chinese:"基隆",english:"Keelung"},
  {chinese:"新竹",english:"Hsinchu"},
  {chinese:"新竹",english:"HsinchuCounty"},
  {chinese:"苗栗",english:"MiaoliCounty"},
  {chinese:"彰化",english:"ChanghuaCounty"},
  {chinese:"南投",english:"NantouCounty"},
  {chinese:"雲林",english:"YunlinCounty"},
  {chinese:"嘉義",english:"ChiayiCounty"},
  {chinese:"嘉義",english:"Chiayi"},
  {chinese:"屏東",english:"PingtungCounty"},
  {chinese:"宜蘭",english:"YilanCounty"},
  {chinese:"花蓮",english:"HualienCounty"},
  {chinese:"臺東",english:"TaitungCounty"},
  {chinese:"金門",english:"KinmenCounty"},
  {chinese:"澎湖",english:"PenghuCounty"},
  {chinese:"連江",english:"LienchiangCounty"},]
const dropDownMenu = document.querySelector('.dropdown-menu>.row');
(function(){
  let str=''
  city.forEach(item=>{
    str+=`
    <div class="col mb-7">
      <button class="btn btn-outline-primary btnCity" data-value="${item.english}">${item.chinese}</button>
    </div>`
  })
  dropDownMenu.innerHTML=str
})();

// 頁面紀錄
let state={};
// sidebar選擇
const cityInput = document.querySelector('#cityInput')
dropDownMenu.addEventListener('click',(e)=>{
  // input顯示城市名稱
  const btn=e.target.closest('button')
  cityInput.value=btn.innerText
  // 搜尋頁面渲染
  renderSearchPage();
  // 搜尋結果渲染
  const city=btn.getAttribute('data-value')
  allData=[];
  getAllData(city,'searchPage')
  // 更新url
  window.history.pushState(state,'台灣旅遊景點導覽',`?city=${city}&&theme=${undefined}&&keyword=${undefined}`)
})
// 城市toggle
$(function(){
  $('.btnCity').on('click',function(){
    $(this).toggleClass('active');
    $(this).parents().siblings().children().removeClass('active');
  })
})

// API驗證
function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  let AppID = '93ad7bf1688a47a3a7f3c346d675d588';
  let AppKey = 'TCbubL4-YuFRXkJsNJ64FcGncG0';
  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString }; 
}

// 串接景點資料
let target='';
let list='';
let allData=[];
function getData(type,city,dom,target,page){ 
  axios({
    method:'get',
    url:`https://ptx.transportdata.tw/MOTC/v2/Tourism/${type}/${city}?$top=500&$format=JSON`,
    headers: getAuthorizationHeader()
  })
    .then((response)=>{
      siteData=response.data;
      filterSite(type,page);
      if(target=='index'){
        renderSite(threeData[type],dom,type);
      }else if(target=='searchPage'){
        renderSite(siteData,searchList,type)
      }
    })
    .catch((error)=>console.log('error',error))
}
function getAllData(city,target,page){
  list=""
  getData('ScenicSpot',city,spotList,target,page);
  getData('Restaurant',city,foodList,target,page);
  getData('Hotel',city,hotelList,target,page);
  getData('Activity',city,activityList,target,page);
  setTimeout(()=>{
    if(document.querySelector('#searchList')){
    const searchList=document.querySelector('#searchList');
    searchList.innerHTML=list
    }
  },500);
}

// 景點渲染
const spotList=document.querySelector('#spotList');
const activityList=document.querySelector('#activityList');
const foodList=document.querySelector('#foodList');
const hotelList=document.querySelector('#hotelList');
// 資料渲染到指定DOM
function renderSite(data,dom,type){
  let str=''
  switch(type){
    case 'ScenicSpot':
      data.forEach(item=>{
        str+=`
        <div class="col">
          <div class="card shadow">
            <div class="bg-position-center bg-size-cover rounded-top" style="background-image: url(${item.Picture.PictureUrl1}); max-height: 182px; min-height: 162px;"></div>
            <div class="card-body position-relative">
              <h4>${item.ScenicSpotName}</h4>
              <div class="text-primary text-truncate">
                <i class="icon-location fs-3 align-middle"><span class="path1"></span><span class="path2"></span></i>
                <small class="me-3">${item.City}</small>
                <i class="icon-time fs-3 align-middle"></i>
                <small>${item.OpenTime}</small> 
              </div>
              <a href="page.html?id=${item.ScenicSpotID}&&type=${type}" class="stretched-link"></a>
            </div>
          </div>
        </div>    
        `
      });
      break;
    case 'Activity':
      data.forEach(item=>{
        let startTime=item.StartTime.substring(0,10)
        let endTime=item.EndTime.substring(0,10)
        str+=`
        <div class="col">
          <div class="card shadow">
            <div class="bg-position-center bg-size-cover rounded-top" style="background-image: url(${item.Picture.PictureUrl1}); max-height: 182px; min-height: 162px;"></div>
            <div class="card-body position-relative">
              <h4 class="text-truncate">${item.ActivityName}</h4>
              <div class="text-primary">
                <i class="icon-time fs-3 align-middle"></i>
                <small class="me-3">${startTime} ~ ${endTime}</small>
                <br>
                <i class="icon-location fs-3 align-middle"><span class="path1"></span><span class="path2"></span></i>
                <small>${item.Location}</small> 
              </div>
              <a href="page.html?id=${item.ActivityID}&&type=${type}" class="stretched-link"></a>
            </div>
          </div>
        </div>    
        `
      });
      break;
    case 'Restaurant':
      data.forEach(item=>{
        str+=`
        <div class="col">
          <div class="card shadow">
            <div class="bg-position-center bg-size-cover rounded-top" style="background-image: url(${item.Picture.PictureUrl1}); max-height: 182px; min-height: 162px;"></div>
            <div class="card-body position-relative">
              <h4 class="text-wrap">${item.RestaurantName}</h4>
              <div class="text-primary">
                <div class="d-flex mb-1">
                  <i class="icon-time fs-3 align-top me-1"></i>
                  <small class="me-3 text-wrap">${item.OpenTime}</small>
                </div>
                <div class="d-flex">
                  <i class="icon-location fs-3 align-middle me-1"><span class="path1"></span><span class="path2"></span></i>
                  <small class="text-wrap">${item.Address}</small> 
                </div>
              </div>
              <a href="page.html?id=${item.RestaurantID}&&type=${type}" class="stretched-link"></a>
            </div>
          </div>
        </div>  
        `
      });      
      break;
    case 'Hotel':
      data.forEach(item=>{
        str+=`
        <div class="col">
          <div class="card shadow">
            <div class="bg-position-center bg-size-cover rounded-top" style="background-image: url(${item.Picture.PictureUrl1}); max-height: 182px; min-height: 162px;"></div>
            <div class="card-body position-relative">
              <h4 class="text-wrap">${item.HotelName}</h4>
              <div class="text-primary">
                <div class="d-flex mb-1">
                  <i class="icon-call fs-3 align-top me-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                  <small class="me-3 text-wrap">${item.Phone}</small>
                </div>
                <div class="d-flex">
                  <i class="icon-location fs-3 align-middle me-1"><span class="path1"></span><span class="path2"></span></i>
                  <small class="text-wrap">${item.Address}</small> 
                </div>
              </div>
              <a href="page.html?id=${item.HotelID}&&type=${type}" class="stretched-link"></a>
            </div>
          </div>
        </div>  
        `
      });
      break;
  }
  if(dom.getAttribute('id')!='searchList'){
    dom.innerHTML=str;
  }else{
    list+=str;
  }
  data.forEach(item=>{
    allData.push({data:item,type:type})
  })
}


// 過濾景點
let threeData={
  ScenicSpot:[],
  Restaurant:[],
  Hotel:[],
  Activity:[]
};
let totalData=[]; 
function filterSite(type,page){
  threeData[type]=[]
  // 過濾資訊不完全的資料
  if(type=='ScenicSpot'){
    siteData=siteData.map(item=>{
      if(item.Picture.PictureUrl1&&item.OpenTime){
        if(item.ScenicSpotName.length<=8&&item.OpenTime.length<=11){
          item.OpenTime=toASCII(item.OpenTime)
          return item
        }
      }
    })
  }else if(type == 'Restaurant') {
    siteData=siteData.map(item=>{
      if(item.Picture.PictureUrl1&&item.OpenTime){
        if(item.RestaurantName.length<=8&&item.OpenTime.length<=11){
          item.OpenTime=toASCII(item.OpenTime)
          return item
        }
      }
    })    
  }
  else if(type=='Hotel'){
    siteData=siteData.map(item=>{
      if(item.Picture.PictureUrl1&&item.Phone&&item.Address){
        return item
      }
    })
  }else if(type=='Activity'){
    siteData=siteData.map(item=>{
      if(item.Picture.PictureUrl1&&item.Location.length<=7){
        return item
      }
    })
  }
  siteData=siteData.filter(item=>item!=undefined)
  // 篩選三筆資料
  for(let i=0;i<3;i++){
    switch(type){
      case 'ScenicSpot':
        threeData.ScenicSpot.push(siteData[i])
      break;
      case 'Restaurant':
        threeData.Restaurant.push(siteData[i])
      break;
      case 'Hotel':
        threeData.Hotel.push(siteData[i])
      break;
      case 'Activity':
        threeData.Activity.push(siteData[i])
      break;
    }
  }
}

// 全形轉半形
function toASCII(text) {
  var ascii = '';
  for(let i=0, l=text.length; i<l; i++) {
      let c = text[i].charCodeAt(0);
      //只針對半形去轉換
      if (c >= 0xFF00 && c <= 0xFFEF) {
          c = 0xFF & (c + 0x20);
      }
      ascii += String.fromCharCode(c);
  }
  return ascii;
}

// 搜尋頁面渲染
const renderSection=document.querySelector('#renderSection')
function renderSearchPage(){
  let city=cityInput.value
  let str=`
  <section class="py-4">
    <h2 class="mb-3 js-city">${city}</h2>
    <div class="row row-cols-1 row-cols-md-3 text-nowrap gy-3" id="searchList">
    </div>
  </section>
  <footer class="py-2 bg-primary mx-n4 text-center">
    <p class="text-white mb-1">TAIWAN TRAVEL</p>
    <small class="text-white">UI Design: jhen | Front-End: Xie Ciao Yun</small>
  </footer>
  `;
  renderSection.innerHTML=str;
}

// 過濾結果渲染
function searchListRender(list){
  if(searchList){
    let str=""
    list.forEach(item=>{
      switch(item.type){
        case 'ScenicSpot':
          str+=`
          <div class="col">
            <div class="card shadow">
              <div class="bg-position-center bg-size-cover rounded-top" style="background-image: url(${item.data.Picture.PictureUrl1}); max-height: 182px; min-height: 162px;"></div>
              <div class="card-body position-relative">
                <h4>${item.data.ScenicSpotName}</h4>
                <div class="text-primary">
                  <i class="icon-location fs-3 align-middle"><span class="path1"></span><span class="path2"></span></i>
                  <small class="me-3">${item.data.City}</small>
                  <i class="icon-time fs-3 align-middle"></i>
                  <small>${item.data.OpenTime}</small> 
                </div>
                <a href="page.html?id=${item.data.ScenicSpotID}&&type=${item.type}" class="stretched-link"></a>
              </div>
            </div>
          </div>    
          `
          break;
          case 'Activity':
            let startTime=item.data.StartTime.substring(0,10)
            let endTime=item.data.EndTime.substring(0,10)
            str+=`
            <div class="col">
              <div class="card shadow">
                <div class="bg-position-center bg-size-cover rounded-top" style="background-image: url(${item.data.Picture.PictureUrl1}); max-height: 182px; min-height: 162px;"></div>

                <div class="card-body position-relative">
                  <h4>${item.data.ActivityName}</h4>
                  <div class="text-primary">
                    <i class="icon-time fs-3 align-middle"></i>
                    <small class="me-3">${startTime} ~ ${endTime}</small>
                    <br>
                    <i class="icon-location fs-3 align-middle"><span class="path1"></span><span class="path2"></span></i>
                    <small>${item.data.Location}</small> 
                  </div>
                  <a href="page.html?id=${item.data.ActivityID}&&type=${item.type}" class="stretched-link"></a>
                </div>
              </div>
            </div>    
            `
          break;
          case 'Restaurant':
            str+=`
            <div class="col">
              <div class="card shadow">
                <div class="bg-position-center bg-size-cover rounded-top" style="background-image: url(${item.data.Picture.PictureUrl1}); max-height: 182px; min-height: 162px;"></div>

                <div class="card-body position-relative">
                  <h4 class="text-wrap">${item.data.RestaurantName}</h4>
                  <div class="text-primary">
                    <div class="d-flex mb-1">
                      <i class="icon-time fs-3 align-top me-1"></i>
                      <small class="me-3 text-wrap">${item.data.OpenTime}</small>
                    </div>
                    <div class="d-flex">
                      <i class="icon-location fs-3 align-middle me-1"><span class="path1"></span><span class="path2"></span></i>
                      <small class="text-wrap">${item.data.Address}</small> 
                    </div>
                  </div>
                  <a href="page.html?id=${item.data.RestaurantID}&&type=${item.type}" class="stretched-link"></a>
                </div>
              </div>
            </div>  
            `     
          break;
          case 'Hotel':
            str+=`
            <div class="col">
              <div class="card shadow">
                <div class="bg-position-center bg-size-cover rounded-top" style="background-image: url(${item.data.Picture.PictureUrl1}); max-height: 182px; min-height: 162px;"></div>

                <div class="card-body position-relative">
                  <h4 class="text-wrap">${item.data.HotelName}</h4>
                  <div class="text-primary">
                    <div class="d-flex mb-1">
                      <i class="icon-call fs-3 align-top me-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                      <small class="me-3 text-wrap">${item.data.Phone}</small>
                    </div>
                    <div class="d-flex">
                      <i class="icon-location fs-3 align-middle me-1"><span class="path1"></span><span class="path2"></span></i>
                      <small class="text-wrap">${item.data.Address}</small> 
                    </div>
                  </div>
                  <a href="page.html?id=${item.data.HotelID}&&type=${item.type}" class="stretched-link"></a>
                </div>
              </div>
            </div>  
            `
          break;
          
      }
    })
    searchList.innerHTML=str
  }
  // 更新url
  getUrlDetail()
}

// 主題按鈕監聽
const theme=document.querySelector('#theme')
theme.addEventListener('click',(e)=>{
  e.preventDefault()
  let theme=e.target.closest('img').getAttribute('data-theme')
  getUrlDetail()
  if(urlCity){
    // 主題過濾
    filterData(theme)
    // 更新url
    getUrlDetail()
    window.history.pushState(state,'台灣旅遊景點導覽',`?city=${urlCity}&&theme=${theme}&&keyword=${undefined}`)
  }else{
    // 更新url (預設新北)
    window.history.pushState(state,'台灣旅遊景點導覽',`?city=NewTaipei&&theme=${theme}&&keyword=${undefined}`)
    getUrlDetail()
    initSearchRender()
    // 非同步
    promise().then((data)=>{
      // 主題篩選
      filterData(urlTheme)
    }).catch(err=>{console.log(err);})
  }
})
// 主題過濾
function filterData(theme){
  let filterType=[];
  let filterData=[];
  switch(theme){
    case 'culture':
      filterType=allData.filter(item=>item.type=='ScenicSpot')
      filterData=filterType.filter(item=>item.data.DescriptionDetail.includes('歷史'))
    break;
    case 'outdoor':
      filterData=allData.filter(item=>item.data.Class1=='都會公園類'||item.data.Class2=='都會公園類')
    break;
    case 'temple':
      filterType=allData.filter(item=>item.type=='ScenicSpot')
      filterData=filterType.filter(item=>item.data.DescriptionDetail.includes('廟'))
    break;
    case 'family':
      filterType=allData.filter(item=>item.type=='ScenicSpot')
      filterData=filterType.filter(item=>item.data.DescriptionDetail.includes('親子'))
    break;
    case 'spot':
      filterData=allData.filter(item=>item.data.Class1=='自然風景類'||item.data.Class2=='自然風景類')
    break;
    case 'food':
      filterData=allData.filter(item=>item.type=='Restaurant')
    break;
    case 'hotel':
      filterData=allData.filter(item=>item.type=='Hotel')
    break;
    case 'tourism':
      filterData=allData.filter(item=>item.type=='Activity')
    break;
  }
  searchListRender(filterData)
}

// 搜尋頁面共同樣式渲染
function initSearchRender(){
  //頁面渲染
  renderSearchPage();
  //渲染標題
  let title=document.querySelector('.js-city')
  let titleCity
  city.forEach(item=>{
    if(item.english==urlCity){
      titleCity=item.chinese
    }
  })
  title.textContent=titleCity
}
// 處理非同步問題
let promise=()=>{
  return new Promise((resolve,reject)=>{
    getAllData(urlCity,'searchPage')
    setTimeout(function(){
      if(allData){
        resolve('success')
      }else{
        reject('false')
      }
    },500)
  })
}
// 初始化
function init(){
  getUrlDetail()
  if(urlKeyword&&urlKeyword!='undefined'){
    initSearchRender()
    // 非同步
    promise().then((data)=>{
      // 關鍵字篩選 
      let keyword=decodeURI(urlKeyword) // 亂碼轉換
      let searchResult=allData.filter(item=>item.data.ScenicSpotName.includes(keyword))
      searchListRender(searchResult)
    }).catch(err=>{console.log(err);})    
  }else if(urlTheme&&urlTheme!='undefined'){
    initSearchRender()
    // 非同步
    promise().then((data)=>{
      // 主題篩選
      filterData(urlTheme)
    }).catch(err=>{console.log(err);})
  }else if(urlTheme&&urlCity!='undefined'){
    initSearchRender()
    getAllData(urlCity,'searchPage')
  }else{
    // 首頁渲染(預設新北市)
    getAllData('NewTaipei','index');
  }
}
init()