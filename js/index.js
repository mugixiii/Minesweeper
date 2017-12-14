var w;
var h;
var bomb;
var flag;
var cell = [];
var timer = 0;
var countColor = ['blue', 'green', 'red', 'orange', 'yellow', 'purple', 'gray', 'black'];
var boxColor = ['gray', 'white', 'red', 'aqua'];

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

function setting() {
	if (!isSet) {
		var difficulty = document.getElementsByClassName("difficulty");

		for (var i = 0; i < difficulty.length; i++) {
			if (difficulty[i].checked) {
				
				if (i == 3) {
					for (var j = 0; j < 3; j++) {
						difficultySetting[i][j] = custom[j].value;
					}
				}
				
				w = difficultySetting[i][0];
				h = difficultySetting[i][1];
				bomb = difficultySetting[i][2];
				
				difficultySelected = true;
			}
		}
		
		if (!difficultySelected) {
			alert("難易度を選択してください");
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
	
	th1.innerHTML = "残り爆弾：0"
	th1.className = "bomb";
	
	th2.innerHTML = "<button onclick='reset()'>リセット</button>";
	th2.className = "reset";
	
	th3.innerHTML = "タイマー：0";
	th3.className = "timer";
	
	table.border = 1;
	
	document.body.appendChild(table);
}

function init() {
	createTable();
	
	var main = document.getElementById("main");
			
	flag = bomb;
	bombLeft[0].textContent = "残り爆弾：" + flag;
	
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
			
			tr.appendChild(td);
		}
		
		main.appendChild(tr);
	}
	
	for (var i = 0; i < bomb; i++) {
		while (true) {
			var x = Math.floor(Math.random() * w);
			var y = Math.floor(Math.random() * h);
			
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
	
	var a = document.getElementsByClassName("cell_open");
	console.log("opened" + a.length);
	
	if (a.length >= (w * h - bomb)) {
		document.getElementById("title").textContent = "Good Job!";
		var unopened = document.getElementsByClassName("cell_unopened");
		cleared = true;
		clearInterval(timerId);		
	}
}

var timerId;

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

			bombLeft[0].textContent = "残り爆弾：" + flag;
		} else if (this.className == "cell_unhold") {
			var src = e.currentTarget;

			if (src.bomb) {
				cell.forEach(function (tr) {
					tr.forEach(function (td) {
						if (td.bomb) {
							td.textContent = String.fromCharCode(9728);
							td.style.backgroundColor = boxColor[2];
						}
					})
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
			timeCount[0].textContent = "タイマー：" + timer;

			console.log(timer);
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

	document.getElementById("main").remove();	
		
	init();
}