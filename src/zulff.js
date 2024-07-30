export class Shape {
	position = {x: 0, y: 0};
	scale = {x: 1, y: 1};
	rotation = 0;
	children = [];
	constructor(onRender, position) {
		if (onRender) {
			this.render = onRender;
		}
		if (position) {
			this.position = position;
		}
	}
	render(ctx) {
	}
}

export class Turtle {
	constructor() {
		this.reset();
	}
	reset() {
		this.position = {x: 0, y: 0};
		this.prevPosition = {x: 0, y: 0};
		this.rotation = 0;
		this.thickness(1);
		this.isDown = true;
	}
	forward(amount) {
		this.prevPosition = this.position;
		this.position = {
			x: this.prevPosition.x + Math.cos(this.rotation) * amount,
			y: this.prevPosition.y + Math.sin(this.rotation) * amount,
		};
		if (this.isDown && this.onLine) {
			this.onLine(this.prevPosition, this.position);
		}
	}
	up() {
		this.isDown = false;
	}
	down() {
		this.isDown = true;
	}
	turn(angle) {
		this.rotation += angle;
	}
	drawPoint() {
		this.onDrawPoint && this.onDrawPoint(this.position, 5, 5);
	}
	color(newColor) {
		this.onColor && this.onColor(newColor);
	}
	thickness(newThickness) {
		this.onThickness && this.onThickness(newThickness);
	}
}

export class CanvasApp {
	constructor(params) {
		const canvas = document.createElement('canvas');
		this.width = params.width;
		this.height = params.height;
		canvas.width = this.width;
		canvas.height = this.height;
		this.ctx = canvas.getContext('2d');
		this.domElement = canvas;
		this.root = new Shape();
		this.turtle = this.createTurtle();
	}
	createTurtle() {
		const turtle = new Turtle();
		turtle.onLine = (from, to) => {
			this.ctx.beginPath();
			this.ctx.moveTo(from.x, from.y);
			this.ctx.lineTo(to.x, to.y);
			this.ctx.stroke();
		};
		turtle.onDrawPoint = (pos, w, h) => {
			this.ctx.fillRect(pos.x, pos.y, w, h);
		};
		turtle.onColor = newColor => {
			this.ctx.fillStyle = newColor;
			this.ctx.strokeStyle = newColor;
		}
		turtle.onThickness = newThickness => {
			this.ctx.lineWidth = newThickness;
		};
		return turtle;
	}
	renderShape(shape) {
		this.ctx.save();
		this.ctx.translate(shape.position.x, shape.position.y)
		this.ctx.rotate(shape.rotation);
		this.ctx.scale(shape.scale.x, shape.scale.y)
		this.turtle.reset();
		shape.render(this.ctx, this.turtle);
		shape.children.forEach(child => {
			this.renderShape(child);
		});
		this.ctx.restore();
	}
	render() {
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.renderShape(this.root);
	}
}

