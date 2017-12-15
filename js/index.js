var w;
var h;
var bomb;
var flag;
var cell = [];
var timer = 0;
var countColor = ['blue', 'green', 'red', 'orange', 'yellow', 'purple', 'gray', 'black'];
var boxColor = ['gray', 'white', 'red', 'aqua', 'yellow'];

var bombLeft = document.getElementsByClassName("bomb");
var custom = document.getElementsByClassName("custom");
var timeCount = document.getElementsByClassName("timer");

var isSet = false;
var started = false;
var cleared = false;

var difficultySelected = false;
var difficultySetting = [
//	[w, h, bomb]						// 難易度
	[8, 8, 10],							// かんたん
	[16, 16, 40],						// ふつう
	[24, 24, 99],						// むずかしい
	[undefined, undefined, undefined]	// カスタム
];

var timerId;

function setting() {
	if (!isSet) {
		var difficulty = document.getElementsByClassName("difficulty");

		for (var i = 0; i < difficulty.length; i++) {
			if (difficulty[i].checked) {
				
				if (i == 3) {
					for (var j = 0; j < 3; j++) {
						if (custom[0].value >= 2 && custom[1].value >= 2 && custom[2].value >= 1 &&
						    (custom[0].value * custom[1].value > custom[2].value)) {
							difficultySetting[i][j] = custom[j].value;
						} else {
							alert("正しく入力してください。");
							return;
						}
					}
				}
				
				w = difficultySetting[i][0];
				h = difficultySetting[i][1];
				bomb = difficultySetting[i][2];
				
				difficultySelected = true;
			}
		}
		
		if (!difficultySelected) {
			alert("難易度を選択してください。");
			return;
		}
	
		isSet = true;

		init();
	}
}

function createTable() {
	started = false;
	cleared = false;
	
	var table = document.createElement("table");
	table.id = "main";
	
	var row = table.insertRow(-1);
	
	var th1 = row.insertCell(-1);
	var th2 = row.insertCell(-1);
	var th3 = row.insertCell(-1);
	
	th1.innerHTML = "0";
	th1.className = "bomb";
	
	th2.innerHTML = "<button onclick='reset()' class='resetButton'><img src='resources/refresh.png' class='resetImg'></button>";
	th2.className = "reset";
	
	th3.innerHTML = "0";
	th3.className = "timer";
	
	table.border = 1;
	
	if (w == 2) {
		th1.colSpan = th2.colSpan = th3.colSpan = 2;
	} else if (w == 3) {
		th1.colSpan = th2.colSpan = th3.colSpan = 1;
	} else if (w > 3) {
		if (w % 2 == 0) {
			th1.colSpan = th3.colSpan = (w - 2) / 2;
			th2.colSpan = 2;
		} else {
			th1.colSpan = th3.colSpan = (w - 3) / 2;
			th2.colSpan = 3;
		}		
	}
	
	document.body.appendChild(table);

	var btn = document.getElementsByClassName("resetButton");
	var img = document.getElementsByClassName("resetImg");
	
	btn[0].style.verticalAlign = img[0].style.verticalAlign = "middle";
	btn[0].style.padding = img[0].style.padding = "1px";
	btn[0].style.backgroundColor = img[0].style.backgroundColor = "white";
	img[0].style.width = img[0].style.height = "24px";
}

function init() {
	createTable();
	
	var main = document.getElementById("main");
			
	flag = bomb;
	bombLeft[0].textContent = flag;
	
	for (var i = 0; i < h; i++) {
		cell[i] = [];
		var tr = document.createElement("tr");
		
		for (var j = 0; j < w; j++) {
			var td = document.createElement("td");
			
			td.addEventListener("click", click);
			td.className = "cell_unhold";
			td.style.backgroundColor = boxColor[0];
			
			td.y = i;
			td.x = j;
			cell[i][j] = td;
			
			if (w == 2) {
				td.colSpan = 3;
				td.style.height = "50px";
			}
			
			tr.appendChild(td);
		}
		
		main.appendChild(tr);
	}
	
	for (var i = 0; i < bomb; i++) {
		while (true) {
			var x = Math.floor(Math.random() * h);
			var y = Math.floor(Math.random() * w);
			
			if (!cell[x][y].bomb) {
				cell[x][y].bomb = true;
//				cell[x][y].textContent = "*";
				break;
			}
		}
	}	
}

function count(x, y) {
	var b = 0;

	for (var j = y - 1; j <= y + 1; j++) {
		for (var i = x - 1; i <= x + 1; i++) {
			if (cell[j] && cell[j][i]) {
				if (cell[j][i].bomb) {
					b++;
				}
			}
		}
	}

	return b;
}

function open(x, y) {
	var c = cell[y][x];
	
	flip(c);	
	
	var n = count(x, y);
	
	if (n == 0) {
		openMultipleCell(x, y);
	} else {
		c.textContent = n;
		c.style.color = countColor[n - 1];				
	}
}

function openMultipleCell(x, y) {
	for (var j = y - 1; j <= y + 1; j++) {
		for (var i = x - 1; i <= x + 1; i++) {
			if (cell[j] && cell[j][i]) {
				var c = cell[j][i];
				
				if (c.opened || c.bomb || c.className == "cell_hold") {
					continue;
				}

				flip(c);

				var n = count(i, j);

				if (n == 0) {
					openMultipleCell(i, j);
				} else {
					c.textContent = n;
					c.style.color = countColor[n-1];
				}
			}
		}
	}
}

function flip(cell) {
	cell.className = "cell_open";
	cell.opened = true;
	cell.style.backgroundColor = boxColor[1];
	
	var cellOpened = document.getElementsByClassName("cell_open");
	
	if (cellOpened.length >= (w * h - bomb)) {
		var cellHold = document.getElementsByClassName("cell_hold");
		var cellUnhold = document.getElementsByClassName("cell_unhold");
		
		for (var i = 0; i < cellHold.length; i++) {
			cellHold[i].style.backgroundColor = boxColor[4];
		}

		for (var i = 0; i < cellUnhold.length; i++) {
			cellUnhold[i].style.backgroundColor = boxColor[4];
		}
		
		document.getElementById("title").textContent = "Good Job!";
		cleared = true;
		clearInterval(timerId);
	}
}

function click(e) {	
	if (!cleared) {
		if (event.shiftKey) {
			if (this.className == "cell_unhold" && flag > 0) {
				this.className = "cell_hold";
				this.style.backgroundColor = boxColor[3];
				flag--;
			} else if (this.className == "cell_hold") {
				this.className = "cell_unhold";
				this.style.backgroundColor = boxColor[0];
				flag++;
			}

			bombLeft[0].textContent = flag;
		} else if (this.className == "cell_unhold") {
			var src = e.currentTarget;

			if (src.bomb) {
				cell.forEach(function (tr) {
					tr.forEach(function (td) {
						if (td.bomb) {
							td.textContent = String.fromCharCode(9728);
							td.style.backgroundColor = boxColor[2];
						}
					});
				});

				document.getElementById("title").textContent = "Game Over";
				cleared = true;
				clearInterval(timerId);
			} else {
				open(src.x, src.y);			
			}		
		}
	}
	
	if (!started && !cleared) {
		timerId = setInterval(function() {
			timer++;
			timeCount[0].textContent = timer;
		}, 1000);
		
		started = true;
	}
}

function refresh() {
	location.reload();
}

function reset() {
	clearInterval(timerId);
	timer = 0;

	document.getElementById("title").textContent = "Minesweeper";
	document.getElementById("main").remove();	
		
	init();
}