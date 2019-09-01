/**
 * Constants
 */

const WIDTH = 100;
const HEIGHT = 100;
const MUTATION = 0.001;
const PALETTE = ["#1e272e", "#f6e58d", "#ffbe76", "#ff7979", "#badc58", "#7ed6df", "#e056fd", "#686de0", "#30336b"]
const TYPES = PALETTE.length;

/**
 * Cellular automata
 */

class Grid {
	constructor(width, height) {
		this.curr = new Array(height).fill(null).map(_ => new Array(width).fill(0));
		this.next = new Array(height).fill(null).map(_ => new Array(width).fill(0));
		this.width = width;
		this.height = height;
		this.done = false;
	}

	update() {
		// Automata
		for (let y = 1; y < this.height - 1; ++y) {
			for (let x = 1; x < this.width - 1; ++x) {
				const val = this.curr[y][x];

				if (val === 0) {
					// Mutation for empty cells
					if (Math.random() < MUTATION) {
						this.next[y][x] = Math.floor(Math.random()*(TYPES-1) + 1);
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

		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				if (this.curr[y][x] !== this.next[y][x]) {
					this.done = false;
				}
				this.curr[y][x] = this.next[y][x];
			}
		}
	}

	draw() {
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				ctx.beginPath();
				ctx.fillStyle = PALETTE[this.curr[y][x]];
				ctx.fillRect(x, y, 1, 1);
			}
		}
	}

	getNeighbors(x, y) {
		let neighbors = new Array(TYPES).fill(0);

		for (let dx = -1; dx <= 1; ++dx) {
			for (let dy = -1; dy <= 1; ++dy) {
				if (dx == 0 && dy == 0) continue;
				++neighbors[this.curr[y+dy][x+dx]];
			}
		}

		return neighbors;
	}

	getDominant(x, y) {
		const neighbors = this.getNeighbors(x, y);

		let max = -Infinity;
		let maxI = 0;

		for (let i = 1; i < TYPES; ++i) {
			if (max < neighbors[i] || (max == neighbors[i] && Math.random() < 0.5)) {
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

	reset() {
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				this.curr[y][x] = 0;
				this.next[y][x] = 0;
			}
		}
	}
}

/**
 * Setup
 */

function setup() {
	window.canvas = document.createElement("canvas");
	window.ctx = canvas.getContext("2d");
	canvas.width = WIDTH
	canvas.height = HEIGHT
	
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