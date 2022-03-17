// API驗證
function getAuthorizationHeader() {
//  填入自己 ID、KEY 開始
  let AppID = '9c65e0f8ed164dbc9c4b399fe6f2a9f6';
  let AppKey = 'yK3mTeDV0zbZDNYh1v38ymum-v0';
//  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString }; 
}

// 渲染下拉選單
const inputCity=[
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
  inputCity.forEach(item=>{
    str+=`
    <div class="col mb-7">
      <button class="btn btn-outline-primary btnCity" data-value="${item.english}">${item.chinese}</button>
    </div>`
  })
  dropDownMenu.innerHTML=str
})();

// sidebar選擇
const cityInput = document.querySelector('#cityInput')
dropDownMenu.addEventListener('click',(e)=>{
  // input顯示城市名稱
  const btn=e.target.closest('button')
  cityInput.value=btn.innerText
  // 搜尋結果渲染
  const city=btn.getAttribute('data-value')
  // 跳轉url
  window.location.href=`index.html?city=${city}&&theme=${undefined}&&keyword=${undefined}`
})

// 主題按鈕監聽
const theme=document.querySelector('#theme')
theme.addEventListener('click',(e)=>{
  e.preventDefault()
  let theme=e.target.closest('img').getAttribute('data-theme')
  // 跳轉url
  window.location.href=`index.html?city=NewTaipei&&theme=${theme}&&keyword=${undefined}`
})

  // 取得ID和類別
let id,type;
function getUrlDetail(){
  let info=location.href.split('?')[1].split('&&')
  id=info[0].split('=')[1]
  type=info[1].split('=')[1]
}
// 取得景點
function getSite(id,type){
  axios({
    method:'get',
    url:`https://ptx.transportdata.tw/MOTC/v2/Tourism/${type}?$filter=${type}ID eq '${id}'&$format=JSON`,
    headers: getAuthorizationHeader()
  })
    .then(res=>{
      detailData=res.data[0]
      renderDetail(type)
    })
    .catch(err=>{
      console.log(err.response);
    })
}

// 詳細資料渲染
let detailData;
function renderDetail(type){
  let name = `${type}Name`
  document.querySelector('.js-name').textContent=detailData[name]
  document.querySelector('.js-figure').innerHTML=`
  <img src="${detailData.Picture.PictureUrl1}" alt="${detailData.Picture.PictureDescription1}" class="rounded-3 w-100" style="max-height:364px">
  `
  document.querySelector('.js-detail').textContent=detailData.DescriptionDetail
  document.querySelector('.js-city').textContent=`${detailData.City}更多景點`
  const info=document.querySelector('.js-info');
  let str=``;
  // 資料分類
  if(detailData.DescriptionDetail){
    str+=`
      <p>
        <i class="icon-time fs-3 align-bottom me-1"></i>
        ${detailData.OpenTime}
      </p>
      <p>
        <i class="icon-call fs-3 align-bottom me-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
        <a href="tel:+${detailData.Phone}" class="text-decoration-none link-secondary">${detailData.Phone}</a> 
      </p>   
      <p>
        <i class="bi bi-house-fill fs-4 align-bottom me-2 text-primary"></i>
        <a href="${detailData.WebsiteUrl}" class="text-decoration-none link-secondary">官方網站</a>
      </p>
    `
  }else if(detailData.StartTime){
    let startTime=detailData.StartTime.substring(0,10)
    let endTime=detailData.EndTime.substring(0,10)
    str+=`
      <p>
        <i class="icon-location fs-3 align-bottom me-1"><span class="path1"></span><span class="path2"></span></i>
        ${detailData.Location}
      </p>
      <p>
        <i class="icon-time fs-3 align-bottom me-1"></i>
        ${startTime} ~ ${endTime}
      </p>
      <p>
        <i class="bi bi-house-fill fs-4 align-bottom me-2 text-primary"></i>
        <a href="${detailData.WebsiteUrl}" class="text-decoration-none link-secondary">官方網站</a>
      </p>   
    `    
  }else if(detailData.ParkingInfo){
    str+=`
      <p>
        <i class="icon-location fs-3 align-bottom me-1"><span class="path1"></span><span class="path2"></span></i>
        ${detailData.Address}
      </p>
      <p>
        <i class="icon-call fs-3 align-bottom me-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
        <a href="tel:+${detailData.Phone}" class="text-decoration-none link-secondary">${detailData.Phone}</a> 
      </p>   
      <p>
        <i class="bi bi-house-fill fs-4 align-bottom me-2 text-primary"></i>
        <a href="${detailData.WebsiteUrl}" class="text-decoration-none link-secondary">官方網站</a>
      </p>  
    `    
  }else{
    str+=`
      <p>
        <i class="icon-location fs-3 align-bottom me-1"><span class="path1"></span><span class="path2"></span></i>
        ${detailData.Address}
      </p>
      <p>
        <i class="icon-time fs-3 align-bottom me-1"></i>
        ${detailData.OpenTime}
      </p>  
    ` 
  }
  // 渲染頁面
  info.innerHTML=str
  // Mapbox
  let mymap = L.map('mapid').setView([detailData.Position.PositionLat, detailData.Position.PositionLon], 13);
  let marker = L.marker([detailData.Position.PositionLat, detailData.Position.PositionLon]).addTo(mymap);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoidGltbXlsaW4iLCJhIjoiY2t1cXdxcGYxNHo5NjJ3bnpydG1weXlpdSJ9.qycnS9vjOptqJcNGhxdZ4w'
  }).addTo(mymap);  
  // 渲染更多景點
  const moreList=document.querySelector('#moreList')
  let siteCity = city[`${detailData.City}`]
  getData(type,siteCity,moreList)
}
// 取得更多景點
function getData(type,city,dom){ 
  axios({
    method:'get',
    url:`https://ptx.transportdata.tw/MOTC/v2/Tourism/${type}/${city}?$top=500&$format=JSON`,
    headers: getAuthorizationHeader()
  })
    .then((response)=>{
      siteData=response.data;
      filterSite(type);
      renderSite(threeData[type],dom,type);
    })
    .catch((error)=>console.log('error',error))
}
//城市列表
const city={
  臺北市:'Taipei',
  新北市:'NewTaipei',
  桃園市:'Taoyuan',
  臺中市:'Taichung',
  臺南市:'Tainan',
  高雄市:'Kaohsiung',
  基隆市:'Keelung',
  新竹市:'Hsinchu',
  新竹縣:'HsinchuCounty',
  苗栗縣:'MiaoliCounty',
  彰化縣:'ChanghuaCounty',
  南投縣:'NantouCounty',
  雲林縣:'YunlinCounty',
  嘉義縣:'ChiayiCounty',
  嘉義市:'Chiayi',
  屏東縣:'PingtungCounty',
  宜蘭縣:'YilanCounty',
  花蓮縣:'HualienCounty',
  臺東縣:'TaitungCounty',
  金門縣:'KinmenCounty',
  澎湖縣:'PenghuCounty',
  連江縣:'LienchiangCounty',  
}
// 過濾景點
let threeData={
  ScenicSpot:[],
  Restaurant:[],
  Hotel:[],
  Activity:[]
};
function filterSite(type){
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
  }else if (type == 'Restaurant'){
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
  let x=Math.floor(Math.random()*15)
  for(let i=x;i<x+3;i++){
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
              <div class="text-primary">
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
              <h4>${item.ActivityName}</h4>
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
}
// 回到上一頁
const previousBtn=document.querySelector('#previousBtn')
previousBtn.addEventListener('click',()=>{
  history.go(-1)
})
// 初始化
function init(){
  getUrlDetail()
  getSite(id,type)
}
init()