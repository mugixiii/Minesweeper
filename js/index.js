var w;
var h;
var bomb;
var flag;
var cell = [];
var opened = 0;
var timer = 0;
var color = ['blue', 'green', 'red', 'orange', 'yellow', 'purple', 'gray', 'black'];

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
		var difficultyValue;

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
		flag = bomb;

		init();
	}
}

function init() {	
	var main = document.getElementById("main");
	
	bombLeft[0].textContent = "残り爆弾：" + flag;
	
	for (var i = 0; i < h; i++) {
		cell [i] = [];
		var tr = document.createElement("tr");
		
		for (var j = 0; j < w; j++) {
			var td = document.createElement("td");
			td.addEventListener("click", click);
			td.className = "cell_unhold";
			
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
					open(i, j);
				} else {
					c.textContent = n;
					c.style.color = color[n-1];
				}
			}
		}
	}
}

function flip(cell) {
	cell.className = "cell_open";
	cell.opened = true;
	
	if (++opened >= (w * h - bomb)) {
		document.getElementById("title").textContent = "Good Job!";
		cleared = true;
	}
}

function click(e) {	
	if (!cleared) {
		if (event.shiftKey) {
			if (this.className == "cell_unhold" && flag > 0) {
				this.className = "cell_hold";
				flag--;
			} else if (this.className == "cell_hold") {
				this.className = "cell_unhold";
				flag++;
			}

			bombLeft[0].textContent = "残り爆弾：" + flag;
		} else if (this.className == "cell_unhold") {
			var src = e.currentTarget;

			if (src.bomb) {
				cell.forEach(function (tr) {
					tr.forEach(function (td) {
						if (td.bomb) {
							td.textContent = "+";
							td.style.backgroundColor = 'red';
						}
					})
				});

				document.getElementById("title").textContent = "Game Over";
				cleared = true;
			} else {
				open(src.x, src.y);			
			}		
		}
	}
	
	if (!started) {
		countup();
		
		started = true;
	}
}

function countup() {
	if (!cleared) {
		setTimeout(countup, 1000);

		timeCount[0].textContent = "タイマー：" + timer;
		timer++;
	} else {
		clearTimeout(countup);
	}
}