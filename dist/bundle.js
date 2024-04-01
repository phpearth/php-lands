(()=>{var e={387:()=>{"use strict";window.onload=function(){!function(e){for(var t,i=document.getElementById("h1"),n=i.innerHTML.replace("&amp;","&").split(""),o="",s=0,a=n.length;a>s;s++)o+=(t=n[s].replace("&","&amp")).trim()?'<span class="letter-'+s+'">'+t+"</span>":"&nbsp;";i.innerHTML=o,setTimeout((function(){i.className="transition-in"}),500*Math.random()+500)}()}},192:()=>{function e(e){var t=this;this.locations=e,this.init=function(){this.viewer=OpenSeadragon({id:"phplandsmap",prefixUrl:"https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/images/",tileSources:document.getElementById("phplandsmap").getAttribute("data-map-src")+"/map.dzi",visibilityRatio:1,constrainDuringPan:!0,minZoomLevel:0,maxZoomLevel:30,maxZoomPixelRatio:4,showNavigator:!0,smoothTileEdgesMinZoom:1,controlsFadeDelay:200,controlsFadeLength:500,navigatorPosition:"BOTTOM_LEFT",overlays:[{id:"tooltip",x:0,y:0,checkResize:!1},{id:"coordinates",x:0,y:0,checkResize:!0}]}),this.svgOverlay=this.viewer.svgOverlay(),this.viewer.addHandler("open",(function(e){document.getElementById("pe-loader").classList.add("disabled"),document.getElementById("pe-dimmer").className="ui disabled inverted dimmer",document.getElementById("phplandsmap").classList.add("pe-grab"),t.initPins(),t.togglePins()})),this.viewer.addHandler("canvas-press",(function(e){document.getElementById("phplandsmap").classList.add("pe-grabbing")})),this.viewer.addHandler("canvas-release",(function(e){document.getElementById("phplandsmap").classList.remove("pe-grabbing")})),this.viewer.addHandler("full-screen",(function(e){document.getElementById("video")&&document.getElementById("video").play()}));let e=new OpenSeadragon.Button({tooltip:"Toggle locations",srcRest:"/assets/img/togglePinButtonRest.png",srcGroup:"/assets/img/togglePinButtonGroupHover.png",srcHover:"/assets/img/togglePinButtonHover.png",srcDown:"/assets/img/togglePinButtonPressed.png"});this.viewer.buttonGroup.buttons.push(e),this.viewer.buttonGroup.element.appendChild(e.element),e.addHandler("click",(function(e){t.togglePins()})),this.viewer.bookmarkUrl()},this.initPins=function(){this.pins=[];for(var e=0;e<this.locations.length;e++){var i=Number(Number(this.locations[e].x)/26240)-.0358/3,n=Number(Number(this.locations[e].y)/26240)-.084/5,o=""!==this.locations[e].link?'<div><a href="'+this.locations[e].link+'" target="_blank" title="Find out more..." id="tooltiplink"><i class="icon linkify"></i></a></div>':"",s='<div class="header"><i class="map marker alternate icon"></i> '+this.locations[e].title+'</div><div class="content">'+this.locations[e].desc+o+"</div>";this.pins[e]=d3.select(this.svgOverlay.node()).append("svg:image").attr("xlink:href","/assets/img/pin.png").attr("width",85).attr("height",85).attr("id","pin_"+e).attr("data-content",s).attr("data-x",i).attr("data-y",n).attr("transform","translate("+i+" "+n+") scale(0.0002)").on("mouseover",(function(){d3.select(this).transition().duration(200).style("opacity",.5).attr("xlink:href","/assets/img/pin_2.png");var e=document.getElementById("tooltip");e.innerHTML=this.getAttribute("data-content"),e.style.zIndex=1e4,e.style.visibility="visible",e.onmouseover=function(){$("#tooltip").stop().fadeIn(0)},e.onmouseenter=function(){$("#tooltip").stop().fadeIn(0)},e.onmouseleave=function(){$("#tooltip").fadeOut(1e3,(function(){this.style.visibility="hidden"}))};var i=Number(this.getAttribute("data-x"))+.0358/3,n=Number(this.getAttribute("data-y"))+.014;t.viewer.updateOverlay("tooltip",new OpenSeadragon.Point(i,n)),$("#tooltip").stop().fadeIn(100),document.getElementById("tooltiplink")&&new OpenSeadragon.MouseTracker({element:"tooltiplink",clickHandler:function(e){e.preventDefaultAction=!0;var t=e.originalEvent.target;t.matches("a")&&("_blank"===t.getAttribute("target")?window.open(t.getAttribute("href")):location.href=t.getAttribute("href"))}})})).on("mouseout",(function(){d3.select(this).transition().style("opacity",1).duration(100).attr("xlink:href","/assets/img/pin.png"),$("#tooltip").fadeOut(1e3,(function(){this.style.visibility="hidden"}))}))}window.addEventListener("resize",(function(e){t.svgOverlay.resize()}))},this.togglePins=function(){"none"===this.svgOverlay.node().style.display?this.svgOverlay.node().style.display="block":this.svgOverlay.node().style.display="none"},this.toggleCoordinates=function(){var e=document.getElementById("coordinates");"visible"!=e.style.visibility?e.style.visibility="visible":e.style.visibility="hidden"},this.enableCoordinates=function(){let e=new OpenSeadragon.Button({tooltip:"Toggle coordinates",srcRest:"/assets/img/toggleCoordinatesButtonRest.png",srcGroup:"/assets/img/toggleCoordinatesButtonGroupHover.png",srcHover:"/assets/img/toggleCoordinatesButtonHover.png",srcDown:"/assets/img/toggleCoordinatesButtonPressed.png"});t.viewer.buttonGroup.buttons.push(e),t.viewer.buttonGroup.element.appendChild(e.element),e.addHandler("click",(function(e){t.toggleCoordinates()})),new OpenSeadragon.MouseTracker({element:t.viewer.container,moveHandler:function(e){var i=t.viewer.viewport.pointFromPixel(e.position),n=t.viewer.viewport.viewportToImageCoordinates(i);document.getElementById("coordinates").innerHTML="<br>("+Math.round(n.x)+" , "+Math.round(n.y)+")",t.viewer.updateOverlay("coordinates",new OpenSeadragon.Point(Number(i.x),Number(i.y)))}})}}var t=new XMLHttpRequest;t.open("GET","/locations.json",!0),t.onload=function(){t.status>=200&&t.status<400&&new e(JSON.parse(t.responseText).data).init()},t.send()},83:(e,t,i)=>{!function(){var e=window.OpenSeadragon;if(!e&&!(e=i(661)))throw new Error("OpenSeadragon is missing.");e.Viewer.prototype.bookmarkUrl=function(t){var i,n=(t=t||{}).trackPage||!1,o=this,s=function(){var e={},t=window.location.hash.replace(/^#/,"");return t&&t.split("&").forEach((function(t){var i=t.split("="),n=i[0],o=parseFloat(i[1]);!n||isNaN(o)?console.error("bad hash param",t):e[n]=o})),e},a=function(){clearTimeout(i),i=setTimeout((function(){var e=o.viewport.getZoom(),t=o.viewport.getCenter(),i=o.currentPage(),s=location.pathname+location.hash,a=location.pathname+"#zoom="+e+"&x="+t.x+"&y="+t.y;n&&(a=a+"&page="+i),history.replaceState({},"",a),a!==s&&o.raiseEvent("bookmark-url-change",{url:location.href})}),100)},r=function(t){var i=o.viewport.getZoom(),s=o.viewport.getCenter(),a=o.currentPage();n&&void 0!==t.page&&t.page!==a?(o.goToPage(t.page),o.addOnceHandler("open",(function(){void 0!==t.zoom&&o.viewport.zoomTo(t.zoom,null,!0),void 0===t.x||void 0===t.y||t.x===s.x&&t.y===s.y||o.viewport.panTo(new e.Point(t.x,t.y),!0)}))):(void 0!==t.zoom&&t.zoom!==i&&o.viewport.zoomTo(t.zoom,null,!0),void 0===t.x||void 0===t.y||t.x===s.x&&t.y===s.y||o.viewport.panTo(new e.Point(t.x,t.y),!0))},l=s();0===this.world.getItemCount()?this.addOnceHandler("open",(function(){r(l)})):r(l),this.addHandler("zoom",a),this.addHandler("pan",a),n&&this.addHandler("page",a),window.addEventListener("hashchange",(function(){r(s())}),!1)}}()},768:(e,t,i)=>{!function(){var e=window.OpenSeadragon;if(!e&&!(e=i(661)))throw new Error("OpenSeadragon is missing.");var t="http://www.w3.org/2000/svg";e.Viewer.prototype.svgOverlay=function(){return this._svgOverlayInfo||(this._svgOverlayInfo=new n(this)),this._svgOverlayInfo};var n=function(e){var i=this;this._viewer=e,this._containerWidth=0,this._containerHeight=0,this._svg=document.createElementNS(t,"svg"),this._svg.style.position="absolute",this._svg.style.left=0,this._svg.style.top=0,this._svg.style.width="100%",this._svg.style.height="100%",this._viewer.canvas.appendChild(this._svg),this._node=document.createElementNS(t,"g"),this._svg.appendChild(this._node),this._viewer.addHandler("animation",(function(){i.resize()})),this._viewer.addHandler("open",(function(){i.resize()})),this._viewer.addHandler("rotate",(function(e){i.resize()})),this._viewer.addHandler("flip",(function(){i.resize()})),this._viewer.addHandler("resize",(function(){i.resize()})),this.resize()};n.prototype={node:function(){return this._node},resize:function(){this._containerWidth!==this._viewer.container.clientWidth&&(this._containerWidth=this._viewer.container.clientWidth,this._svg.setAttribute("width",this._containerWidth)),this._containerHeight!==this._viewer.container.clientHeight&&(this._containerHeight=this._viewer.container.clientHeight,this._svg.setAttribute("height",this._containerHeight));var t=this._viewer.viewport.pixelFromPoint(new e.Point(0,0),!0),i=this._viewer.viewport.getZoom(!0),n=this._viewer.viewport.getRotation(),o=this._viewer.viewport.getFlip(),s=this._viewer.viewport._containerInnerSize.x,a=s*i,r=a;o&&(a=-a,t.x=-t.x+s),this._node.setAttribute("transform","translate("+t.x+","+t.y+") scale("+a+","+r+") rotate("+n+")")},onClick:function(t,i){new e.MouseTracker({element:t,clickHandler:i}).setTracking(!0)}}}()},661:e=>{"use strict";e.exports=OpenSeadragon}},t={};function i(n){var o=t[n];if(void 0!==o)return o.exports;var s=t[n]={exports:{}};return e[n](s,s.exports,i),s.exports}i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";i(83),i(768),i(387),i(192)})()})();