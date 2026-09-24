function uid(){return Math.random().toString(36).slice(2,10)}
function load(){try{return JSON.parse(localStorage.getItem(STORE))}catch(e){return null}}
function save(s){localStorage.setItem(STORE,JSON.stringify(s))}
function defaultState(){return{settings:{name:"Home",lat:32.7767,lon:-96.7970,tz:"America/Chicago",grass:"bermuda",lotSqFt:8000,waterCostPerKgals:6.5,controller:"Rain Bird",address:"Dallas, TX"},zones:[],valves:[],heads:[],runs:[],feedLog:[],weatherCache:null}}
let state=Object.assign(defaultState(),load()||{});
state.settings=Object.assign(defaultState().settings,state.settings||{});
state.zones=state.zones||[];state.valves=state.valves||[];state.heads=state.heads||[];state.runs=state.runs||[];state.feedLog=state.feedLog||[];
let map,layers={zones:null,valves:null,heads:null},tool="pan",draft=[],selected=null,weather=null;
function persist(){save(state)}
function initMap(){
  var el=document.getElementById("map");
  if(!el)return;
  if(typeof L==="undefined"){el.innerHTML="<p style='padding:12px;color:#e8c36a'>Map library blocked. Open this page in Safari.</p>";return}
  if(map){map.remove();map=null}
  el.style.height=Math.max(260,Math.floor(window.innerHeight*0.5))+"px";
  map=L.map(el,{zoomControl:true}).setView([state.settings.lat,state.settings.lon],18);
  var sat=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,attribution:"Esri"});
  var osm=L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"OSM"});
  sat.addTo(map);
  sat.on("tileerror",function(){if(!map.hasLayer(osm))osm.addTo(map)});
  layers.zones=L.layerGroup().addTo(map);
  layers.valves=L.layerGroup().addTo(map);
  layers.heads=L.layerGroup().addTo(map);
  map.on("click",onMapClick);
  redrawMap();
  setTimeout(function(){if(map)map.invalidateSize()},250);
  setTimeout(function(){if(map)map.invalidateSize()},1000);
}
function zoneColor(i){return ["#3dcc8a","#7ad4ff","#e8c36a","#c79bff","#ef7a6a","#9ad0a8"][i%6]}
function redrawMap(){if(!layers.zones||!map)return;layers.zones.clearLayers();layers.valves.clearLayers();layers.heads.clearLayers();state.zones.forEach(function(z,i){if(!z.latlngs||z.latlngs.length<3)return;var poly=L.polygon(z.latlngs,{color:zoneColor(i),weight:2,fillOpacity:.22});poly.on("click",function(e){L.DomEvent.stop(e);select("zone",z.id)});poly.bindTooltip(z.name||("Zone "+(z.station||"")));poly.addTo(layers.zones)});state.valves.forEach(function(v){var m=L.circleMarker(v.latlng,{radius:8,color:"#e8c36a",fillColor:"#e8c36a",fillOpacity:1});m.on("click",function(e){L.DomEvent.stop(e);select("valve",v.id)});m.bindTooltip(v.name||"Valve");m.addTo(layers.valves)});state.heads.forEach(function(h){var m=L.circleMarker(h.latlng,{radius:6,color:"#7ad4ff",fillColor:"#0b1210",fillOpacity:1});m.on("click",function(e){L.DomEvent.stop(e);select("head",h.id)});L.circle(h.latlng,{radius:(h.radiusFt||15)*0.3048,color:"#7ad4ff",weight:1,dashArray:"4 4",fillOpacity:.05}).addTo(layers.heads);m.bindTooltip((h.name||"Head")+" "+(h.gpm||"?")+" gpm");m.addTo(layers.heads)});if(draft.length){L.polyline(draft,{color:"#fff",dashArray:"6 4"}).addTo(layers.zones);draft.forEach(function(p){L.circleMarker(p,{radius:4,color:"#fff"}).addTo(layers.zones)})}}
function onMapClick(e){var ll=[e.latlng.lat,e.latlng.lng];if(tool==="zone"){draft.push(ll);redrawMap();return}if(tool==="valve"){var v={id:uid(),name:"Valve "+(state.valves.length+1),station:"",latlng:ll,notes:""};state.valves.push(v);persist();select("valve",v.id);redrawMap();return}if(tool==="head"){var h={id:uid(),name:"Head "+(state.heads.length+1),zoneId:"",preset:"RB 15' spray H",type:"spray",radiusFt:15,arc:180,gpm:1.58,latlng:ll};state.heads.push(h);persist();select("head",h.id);redrawMap()}}
function finishZone(){if(draft.length<3)return;var z={id:uid(),name:"Zone "+(state.zones.length+1),station:String(state.zones.length+1),valveId:"",minutes:20,latlngs:draft.slice(),notes:""};state.zones.push(z);draft=[];persist();select("zone",z.id);setTool("pan");redrawMap()}
function setTool(t){tool=t;document.querySelectorAll(".tool").forEach(function(b){b.classList.toggle("active",b.dataset.tool===t)})}
function select(kind,id){selected={kind:kind,id:id};renderEditor()}
function find(kind,id){return state[kind+"s"].find(function(x){return x.id===id})}
function polygonAreaSqFt(ll){if(!ll||ll.length<3)return 0;var R=6371000,a=0,i;for(i=0;i<ll.length;i++){var lat1=ll[i][0],lon1=ll[i][1],lat2=ll[(i+1)%ll.length][0],lon2=ll[(i+1)%ll.length][1];a+=(lon2-lon1)*Math.PI/180*(2+Math.sin(lat1*Math.PI/180)+Math.sin(lat2*Math.PI/180))}return Math.abs(a*R*R/2)*10.7639}
function zoneArea(z){return Math.round(polygonAreaSqFt(z.latlngs))}
function zoneGpm(z){return state.heads.filter(function(h){return h.zoneId===z.id}).reduce(function(s,h){return s+Number(h.gpm||0)},0)}
function inchesFromRun(gpm,min,area){return area?(gpm*min)/(area*0.623):0}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return ({
"&":"&","<":"<",">":">","\"":""","'":"&#39;"})[c]})}
function val(id){return document.getElementById(id).value}
function num(id){return parseFloat(document.getElementById(id).value)||0}
