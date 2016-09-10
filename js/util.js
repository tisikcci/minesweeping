//dropDownMenu
//four level
var setLevel = {
	primary: {x:9, y:9, mines:10},
	middle: {x:16, y:16, mines:40},
	advanced: {x:16, y:30, mines:99},
	expert: {x:30, y:45, mines:199}
};
var arrayData;
// var cellInfo = []; 
var n,
	m,
	setlevel = [],
	flagAddress = [],
	rightClickNum,
	restMines,
	markMine,
	timeBool,
	times,
	timeClock;



function reset(){
	setCellContainer(setlevel[setlevel.length - 1]);

}

function setCellContainer(level){
	var main,
		level,
		article,
		main_header,
		fragment,
		div,
		cell,
		i,
		j,
		hundredsTime,
		decadeTime,
		unitsTime,
		hundredsTime,
		decadeTime,
		unitsTime,
		button;
		rightClickNum = 0,
		markMine = -1;
	window.clearInterval(timeClock);
	timeBool = true;
	times = 0;
	timeClock = false;
	var faceIcon = document.getElementById("restart-game");
	faceIcon.style.backgroundPosition = "-3px -3px";
	main = document.getElementById("main");
	level = level||setLevel.primary;
	m = level.x;
	n = level.y;
	restMines = level.mines;
	setRestMines();
	setlevel.push(level);
	article = document.getElementById("article");
	main_header = document.getElementById("main-header");
	cell_container = document.getElementById("cell-container");

	cell_container_height = m * 16 + m;
	cell_container_width = n * 16 + n;

	main.style.width = cell_container_width + 10 + "px";
	main_header.style.width = cell_container_width + "px";

	cell_container.style.height = cell_container_height + "px";
	cell_container.style.width = cell_container_width + "px";
	
	article.style.width = cell_container_width + 20 + "px";
	article.style.height = cell_container_height + 90 + "px";

	hundredsTime = document.getElementById("hundredsTime");
	decadeTime = document.getElementById("decadeTime");
	unitsTime = document.getElementById("unitsTime");
	hundredsTime.style.backgroundPosition = "0 24px" ;
	decadeTime.style.backgroundPosition = "0 24px";
	unitsTime.style.backgroundPosition = "0 24px";
	cell = null;
	fragment = document.createDocumentFragment();
	div = document.getElementById("cell-container");
	div.innerHTML = "";
	for(i = 0; i < m; i++){
		for(j = 0; j < n; j++){
			cell = document.createElement("button");
			cell.appendChild(document.createTextNode(""));
			cell.setAttribute("class","cell");
			cell.setAttribute("id",i * n + j);
			fragment.appendChild(cell);
		}	
	}
	clickListener();
	div.appendChild(fragment);
	return arrayData = checkAroundNum(m,n,level);

}

function keydown(evt){
	var evt,
		eKeyCode;
	evt = evt ? evt : (window.event ? window.event : "");
	eKeyCode = evt.keyCode ? evt.keyCode : (evt.which ? evt.which : evt.charCode);
	if(eKeyCode == 113){
		setCellContainer();
	}
	if(eKeyCode == 112){
		aboutGame();
	}
}		

function aboutGame(){
	var aboutConent = "Javascript版扫雷\n版本：1.0\n作者：tisikcci";
	alert(aboutConent);
}

window.onload = function(){
	setCellContainer(setLevel.primary);
	document.oncontextmenu = function(){
		return false;
	};


};
//game
//information about the location of mines
function randomArray(m,n,level){
	var mine_num,
		sum,
		a = [],
		b = [],
		c = [],
		i,
		j;
	mine_num = level.mines;
	sum = m * n;
	for(i=0;i<sum;i++){
		a[i] = i;
		c[i] = 0;
	}
	for(j=0;j<mine_num;j++){
		b.push(a.splice(Math.floor(Math.random()*a.length),1));
		c[b[j]]=1;
	}
	return c;
}

//information about the mines around itself
function checkAroundNum(m,n,level){
	var i,
		j,
		left_top,
		left_left,
		left_buttom,
		top_top,
		top_right,
		right_right,
		right_buttom,
		buttom_buttom,
		index,
		a = [],
		b = [],
		c = [];
		c = randomArray(m,n,level);

		for(i=0;i<m;i++){
			for(j=0;j<n;j++){
				index = i * n + j;
				a[index] = 0;
				if(c[index]==0){
					left_top = (i>0&&j>0) ? c[(i - 1) * n + j - 1] : 0;
					left_left = (j>0) ? c[i * n + j -1] : 0;
					left_buttom = (i<m-1&&j>0) ? c[(i + 1) * n + j - 1] : 0;
					top_top = (i>0) ? c[(i - 1) * n + j] : 0;
					top_right = (i>0&&j<n-1) ? c[(i - 1) * n + j + 1] : 0;
					right_right = (j<n-1) ? c[i * n + j + 1] : 0;
					right_buttom = (i<m-1&&j<n-1) ? c[(i + 1) * n + j + 1] : 0;
					buttom_buttom = (i<m-1) ? c[(i + 1) * n + j] : 0;
				}
				a[index] = left_top + left_left + left_buttom + top_top + top_right + right_right + right_buttom + buttom_buttom;
			}
		}
		b = {a,c};
		return b;
}

function clickListener(){
	var id,
		cellListener,
		cell_n,
	cellListener=document.getElementById("cell-container");
	cellListener.addEventListener("mouseup",clickEvent);
	return false;
}

function clickEvent(event){
	var id,
		cell_n;
	var oldYPosition = 0;
	if(event.target||event.target.className=="cell"){
		id = event.target.id;
		cell_n = document.getElementById(id);
		oldYPosition = parseInt(cell_n.style.backgroundPosition.slice(4, -2))||0;
		if(event.button==0){
			timeBool = false;
			leftClick(id,cell_n,oldYPosition);
			
		};
		if(event.button==2){
			rightClick(id,cell_n,oldYPosition);

		};
	}
}

function leftClick(id,cell_n,oldYPosition){
	var aroundMinesArr = arrayData.a;
	var minuesInfo = arrayData.c;
	var yPosition = aroundMinesArr[id] * 16 + 16 + "px";
	var idChecked = [];
	var faceIcon = document.getElementById("restart-game");
	if(!timeBool&&!timeClock)
	timeClock = setInterval("costTime()",1000);
	if(oldYPosition == -16){
		return;
	}
	if(minuesInfo[id]!==0){
		window.clearInterval(timeClock);
		deadDisplay(faceIcon,aroundMinesArr,minuesInfo);

	}else{
		cell_n.disabled = true;
		cell_n.style.backgroundPosition = "-1px " + 0 + "px";
		cell_n.style.backgroundPosition = "-1px " + yPosition;
		if(aroundMinesArr[id] == 0){
			aroundNomines(idChecked,id,aroundMinesArr);
		}
			
	}
}

function rightClick(id,cell_n,oldYPosition){
	var	yPosition;
	var minuesInfo = arrayData.c;
	setRestMines(oldYPosition);
	if(oldYPosition<-17){
		oldYPosition = 16;
	}
	oldYPosition += (-16); //0 -16 -32 

	if(minuesInfo[id]==1){
		if(oldYPosition== -16){
			rightClickNum++;
		}else{
			rightClickNum--;
		}
		if(rightClickNum==restMines){
			window.clearInterval(timeClock);
			alert("you win!");
		}
	}

	yPosition = oldYPosition + "px";
	cell_n.style.backgroundPosition = "-1px " + yPosition;
}

function aroundNomines(idChecked,id,aroundMinesArr){
	var i = Math.floor(id / n);
	var j = id - i * n;
	idChecked[id] = 1;
	if(i>0&&j>0){//left-top
		var newId = (i - 1) * n + j - 1;
		recursionContent(idChecked,newId,aroundMinesArr);
	};
	if(j>0){//left-left
		var newId = i * n + j - 1;
		recursionContent(idChecked,newId,aroundMinesArr);
	};
	if(j>0&&i<m-1){//left-buttom
		var newId = (i + 1) * n +j - 1;
		recursionContent(idChecked,newId,aroundMinesArr);
	};	
	if(i>0){//top-top
		newId = (i - 1) * n + j;
		recursionContent(idChecked,newId,aroundMinesArr);
	};
	if(i>0&&j<n-1){//top-right
		newId = (i - 1) * n + j + 1;
		recursionContent(idChecked,newId,aroundMinesArr);
	};	
	if(j<n-1){//right-right
		newId = i * n + j + 1;
		recursionContent(idChecked,newId,aroundMinesArr);
	};
	if(i<m-1&&j<n-1){//right-buttom
		newId = (i + 1) * n + j + 1;
		recursionContent(idChecked,newId,aroundMinesArr);
	};
	if(i<m-1){//buttom-buttom
		newId = (i + 1) * n + j;
		recursionContent(idChecked,newId,aroundMinesArr);
	};

}

function recursionContent(idChecked,newId,aroundMinesArr){
	var newIdCell = document.getElementById(newId);
	var newYPosition = parseInt(newIdCell.style.backgroundPosition.slice(4, -2))||0;
	if(newYPosition==-16){
		return;
	}{
		if(aroundMinesArr[newId]!=0){
			setCellBg(newId,aroundMinesArr);
		}else{
			if(idChecked[newId]&&idChecked[newId]==1){
				return;
			}else{
				setCellBg(newId,aroundMinesArr);
				aroundNomines(idChecked,newId,aroundMinesArr);
			}
		}
	}

}

function setCellBg(id,aroundMinesArr){
	cell_n = document.getElementById(id);
	cell_n.disabled = true;
	var yPosition = aroundMinesArr[id] * 16 + 16 + "px";
	cell_n.style.backgroundPosition = "-1px " + yPosition;
}

function deadDisplay(faceIcon,aroundMinesArr,minuesInfo){
	var arrayLength = aroundMinesArr.length;
	var mineLength = minuesInfo.length;
	var i,
		idNum,
		yPosition;
	for(i=0;i<arrayLength;i++){
		setCellBg(i,aroundMinesArr);
	}
	for(i=0;i<mineLength;i++){
		if(minuesInfo[i]==1){
			idNum = document.getElementById(i);
			yPosition = "-48px";
			idNum.style.backgroundPosition = "-1px " + yPosition;
		}
		
	}
	faceIcon.style.backgroundPosition = "-2px -50px";

}

function setRestMines(oldYPosition){
	var hundreds,
		decades,
		units,
		hundred,
		ten,
		unit,
		yPosition100,
		yPosition10,
		yPosition1,
		livineMines;
	if(oldYPosition==-16){
		markMine--;
	}else if(oldYPosition==-32){

	}else{
		markMine++;
	}
	livineMines = restMines - markMine;

	hundreds = document.getElementById("hundreds");
	decades = document.getElementById("decades");
	units = document.getElementById("units");
	hundred = Math.floor(livineMines/100);
	ten =Math.floor(livineMines/10) - hundred * 10;
	unit = livineMines - hundred * 100 - ten * 10;
	if(livineMines<0){
		hundred = 0;
		ten = 0;
		unit = 0;

	}

	yPosition100 =  hundred * 23 + 24 + "px";
	yPosition10 =  ten * 23 + 24 + "px";
	yPosition1 =  unit * 23 + 24 + "px";
	hundreds.style.backgroundPosition = "0px " + yPosition100;
	decades.style.backgroundPosition = "0px " + yPosition10;
	units.style.backgroundPosition = "0px " + yPosition1;
}


function costTime(){
	var hundredsTime,
		decadeTime,
		unitsTime,
		hundred,
		ten,
		unit,
		yPosition100,
		yPosition10,
		yPosition1;
	times++;
	hundredsTime = document.getElementById("hundredsTime");
	decadeTime = document.getElementById("decadeTime");
	unitsTime = document.getElementById("unitsTime");
	hundred = Math.floor(times/100);
	ten = Math.floor(times/10) - hundred * 10;
	unit = times - hundred * 100 - ten * 10;
	yPosition100 =  hundred * 23 + 24 + "px";
	yPosition10 =  ten * 23 + 24 + "px";
	yPosition1 =  unit * 23 + 24 + "px";
	hundredsTime.style.backgroundPosition = "0px " + yPosition100;
	decadeTime.style.backgroundPosition = "0px " + yPosition10;
	unitsTime.style.backgroundPosition = "0px " + yPosition1;

}

function showList(o) {
    hideList(o.id + "-menu");
    document.getElementById(o.id + "-menu").classList.toggle("show");
}

function hideList(option) {
	var dropdowns = document.getElementsByClassName("btn-content");
	for (var i = 0; i < dropdowns.length; i++) {
		var openDropdown = dropdowns[i];
		// console.log(openDropdown.id);
		console.log(option);
		if (openDropdown.id != option) {
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}

window.onclick = function(e) {
			if (!e.target.matches('.dropbtn')) {
				hideList("");
			}
		}