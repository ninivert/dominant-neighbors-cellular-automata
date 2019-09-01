"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Constants
 */

var WIDTH = 100;
var HEIGHT = 100;
var MUTATION = 0.001;
var PALETTE = ["#1e272e", "#f6e58d", "#ffbe76", "#ff7979", "#badc58", "#7ed6df", "#e056fd", "#686de0", "#30336b"];
var TYPES = PALETTE.length;

/**
 * Cellular automata
 */

var Grid = function () {
	function Grid(width, height) {
		_classCallCheck(this, Grid);

		this.curr = new Array(height).fill(null).map(function (_) {
			return new Array(width).fill(0);
		});
		this.next = new Array(height).fill(null).map(function (_) {
			return new Array(width).fill(0);
		});
		this.width = width;
		this.height = height;
		this.done = false;
	}

	_createClass(Grid, [{
		key: "update",
		value: function update() {
			// Automata
			for (var y = 1; y < this.height - 1; ++y) {
				for (var x = 1; x < this.width - 1; ++x) {
					var val = this.curr[y][x];

					if (val === 0) {
						// Mutation for empty cells
						if (Math.random() < MUTATION) {
							this.next[y][x] = Math.floor(Math.random() * (TYPES - 1) + 1);
						}

						// Cells spread
						else {
								this.next[y][x] = this.getDominant(x, y);
							}
					}
				}
			}

			// Update next to curr
			this.done = true;

			for (var _y = 0; _y < this.height; ++_y) {
				for (var _x = 0; _x < this.width; ++_x) {
					if (this.curr[_y][_x] !== this.next[_y][_x]) {
						this.done = false;
					}
					this.curr[_y][_x] = this.next[_y][_x];
				}
			}
		}
	}, {
		key: "draw",
		value: function draw() {
			for (var y = 0; y < this.height; ++y) {
				for (var x = 0; x < this.width; ++x) {
					ctx.beginPath();
					ctx.fillStyle = PALETTE[this.curr[y][x]];
					ctx.fillRect(x, y, 1, 1);
				}
			}
		}
	}, {
		key: "getNeighbors",
		value: function getNeighbors(x, y) {
			var neighbors = new Array(TYPES).fill(0);

			for (var dx = -1; dx <= 1; ++dx) {
				for (var dy = -1; dy <= 1; ++dy) {
					if (dx == 0 && dy == 0) continue;
					++neighbors[this.curr[y + dy][x + dx]];
				}
			}

			return neighbors;
		}
	}, {
		key: "getDominant",
		value: function getDominant(x, y) {
			var neighbors = this.getNeighbors(x, y);

			var max = -Infinity;
			var maxI = 0;

			for (var i = 1; i < TYPES; ++i) {
				if (max < neighbors[i] || max == neighbors[i] && Math.random() < 0.5) {
					max = neighbors[i];
					maxI = i;
				}
			}

			if (max > 0) {
				return maxI;
			} else {
				return 0;
			}
		}
	}, {
		key: "reset",
		value: function reset() {
			for (var y = 0; y < this.height; ++y) {
				for (var x = 0; x < this.width; ++x) {
					this.curr[y][x] = 0;
					this.next[y][x] = 0;
				}
			}
		}
	}]);

	return Grid;
}();

/**
 * Setup
 */

function setup() {
	window.canvas = document.createElement("canvas");
	window.ctx = canvas.getContext("2d");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	document.body.appendChild(canvas);

	window.grid = new Grid(WIDTH, HEIGHT);

	window.nextframe = null;

	init();
}

/**
 * Init
 */

function init() {
	cancelAnimationFrame(nextframe);

	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	grid.reset();

	nextframe = requestAnimationFrame(draw);
}

/**
 * Drawing
 */

function draw() {
	grid.update();
	grid.draw();

	if (grid.done === false) {
		nextframe = requestAnimationFrame(draw);
	} else {
		setTimeout(init, 1000);
	}
}

setup();
//# sourceMappingURL=index.js.map