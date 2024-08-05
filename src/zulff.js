export class Shape {
	position = {x: 0, y: 0};
	scale = {x: 1, y: 1};
	rotation = 0;
	children = [];
	constructor(onRender, position) {
		if (onRender) {
			this.onRender = onRender;
		}
		if (position) {
			this.position = position;
		}
	}
	render(ctx, turtle) {
		this.onRender && this.onRender(ctx, turtle);
		this.min = {...turtle.min};
		this.max = {...turtle.max};
	}
	renderBoundingBox(ctx) {
		ctx.fillStyle = this.hit? 'rgb(255 255 200 / 0.5)' : 'rgb(255 255 255 / 0.2)';
		ctx.fillRect(this.min.x, this.min.y, this.max.x - this.min.x, this.max.y - this.min.y);
		ctx.fillStyle = 'yellow';
		const axisSize = 16;
		ctx.fillRect(-axisSize / 2, 0, axisSize, 2);
		ctx.fillRect(0, -axisSize / 2, 2, axisSize);
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
		this.min = {x: Infinity, y: Infinity};
		this.max = {x: -Infinity, y: -Infinity};
	}
	moveTo(newPosition) {
		this.prevPosition = this.position;
		this.position = newPosition;
		if (newPosition.x < this.min.x) this.min.x = newPosition.x;
		if (newPosition.x > this.max.x) this.max.x = newPosition.x;
		if (newPosition.y < this.min.y) this.min.y = newPosition.y;
		if (newPosition.y > this.max.y) this.max.y = newPosition.y;
	}
	forward(amount) {
		this.moveTo({
			x: this.position.x + Math.cos(this.rotation) * amount,
			y: this.position.y + Math.sin(this.rotation) * amount,
		});
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
		this.rotation = this.rotation % (Math.PI * 2);
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
	rectangle(width, height) {
		this.forward(width);
		this.turn(Math.PI * 0.5);
		this.forward(height);
		this.turn(Math.PI * 0.5);
		this.forward(width);
		this.turn(Math.PI * 0.5);
		this.forward(height);
		this.turn(Math.PI * 0.5);
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
		this.debug = false;
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
		if (this.debug) shape.renderBoundingBox(this.ctx);
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

