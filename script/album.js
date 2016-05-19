//图片
var pics = [];
for (var i = 0; i < 20; i++) {
  var img = new Image();
  img.src = 'http://o7dn9mux7.bkt.clouddn.com/img' + i + '.jpg';
  pics.push(img);
}
// pics.sort(function () {
// 	return Math.random() > 0.5 ? 1 : -1;
// })
pics.sort(() => (Math.random() > 0.5 ? 1 : -1));
//设置图片源
function setPics() {
	var pic = new Image();
	pic.src = '';
	pics.push(pic);
}

//将图片添加到DOM
function addPic2DOM(num) {
	var wrap = document.getElementById('wrap');
	var fragment = document.createDocumentFragment();
	for (var i = 0; i < num; i++) {
		var newBox = document.createElement("div");
		var newPic = document.createElement("div");
		var pic = new Image();
		pic.src = pics[i].src;
		newPic.appendChild(pic);
		newPic.className = "image";
		newBox.appendChild(newPic);
		newBox.className = "box";
		fragment.appendChild(newBox);
	}
	wrap.appendChild(fragment);
}

//判断是否需要加载图片
function isNeedLoad() {
	var boxs = document.getElementsByClassName("box");
	var lastPicHeight = boxs[boxs.length - 1].offsetTop;
	var scrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
	var screenHeight = document.body.clientHeight || document.documentElement.clientHeight;
	var nowHeight = scrollHeight + screenHeight;
	return (lastPicHeight > nowHeight) ? false : true;
}

//点击图片
function clickPic(e) {
	var target = e.target;
	var mask = document.getElementById('mask');
	var pic = new Image();
	pic.src = target.src;

	var screenW = document.documentElement.clientWidth;
	var screenH = document.documentElement.clientHeight;
	screenW *= 0.6;
	screenH *= 0.6;
	if(pic.height > screenH) {pic.width *= (screenH / pic.height);pic.height = screenH;}
	if(pic.width > screenW) {pic.height *= (screenW / pic.width);pic.width = screenW;}
	console.log(`pic.height: ${pic.height}`);
	console.log(`pic.width: ${pic.width}`);

	mask.innerHTML = "";
	mask.appendChild(pic);
	mask.style.display = "flex";
}
//将添加到DOM中的图片按照瀑布流布局
function waterfall(col) {
  var cols = col || getCols();
  var boxs = document.getElementsByClassName("box");
  var boxW = boxs[0].offsetWidth;
  wrap.style.width = boxW * cols + "px";
  wrap.style.margin = "0 auto";
  var colHeight = [];
  for (var i = 0; i < boxs.length; i++) {
    if (i < cols) {
      colHeight.push(boxs[i].offsetHeight);
      boxs[i].style.position = "static";//取消第一行图片的定位，
    }else {
      var minColH = Math.min.apply(null,colHeight);
      var minColHIndex = getIndex(colHeight,minColH);
      boxs[i].style.position = "absolute";
      boxs[i].style.top = minColH + "px";
      boxs[i].style.left = boxW * minColHIndex +"px";
      colHeight[minColHIndex] += boxs[i].offsetHeight;
    }
  }
  flag = true;
  return cols;
}
//获取高度最小的列号索引
function getIndex(arr,data) {
  for (var i in arr) {
    if (arr[i] == data) {
      return i;
    }
  }
}

//获取当前屏幕可以容纳的列数
function getCols() {
	var wrap = document.getElementById("wrap");
  var boxs = document.getElementsByClassName("box");
  var screenW = document.documentElement.clientWidth;
  var boxW = boxs[0].offsetWidth;
  var cols = Math.floor(screenW / boxW);
  return cols;
}

var flag = true;
window.onload = function () {
	//判断屏幕变化并改变列数，只有当列数改变时才重新渲染
	var col;
	window.onresize = function () {
	  var cols = getCols();
		if(col !== cols){
			col = waterfall();
		}
	}

	var loader = document.getElementsByClassName('loading')[0];
	var wrap = document.getElementById('wrap');
	loader.style.display = "none";
	wrap.style.display = "block";
	addPic2DOM(20);
	waterfall();
	window.onscroll = function () {
		if(isNeedLoad() && flag){
			flag = false;
			addPic2DOM(10);
			waterfall();
		}
	}
	wrap.addEventListener("click", function (e) {
		e.stopPropagation();
		clickPic(e);
	},false);

	var mask = document.getElementById('mask');
	mask.addEventListener("click", function () {
		mask.style.display = "none";
	},false);

	// var img = mask.chlidNode[0];
	// mask.addEventListener('mousedown', md, false);
	// function md(e) {
	// 	e = e.target;
	// 	var disX = e.clientX - img.offsetLeft,
	// 			disY = e.clientY - img.offsetTop;
	// 	document.onmousemove = function (event) {
	// 		changeX = event.clientX - disX;
	// 		changeY = event.clientY - disY;	
	// 		img.style.top = changeY + 100 +'px';
	// 		img.style.left = changeX + 150 +'px';
	// 	}
	// 	document.onmouseup = function () {
	// 		document.onmousemove = null;
	// 		document.onmouseup = null;
	// 	}
	// }
}