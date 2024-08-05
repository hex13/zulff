import * as assert from 'node:assert';
import { CanvasApp, Turtle, Shape } from './zulff';

class MockCanvas {
	getContext() {}
};

global.document = {
	createElement(type) {
		if (type == 'canvas') {
			return new MockCanvas();
		}
	}
};

describe('CanvasApp', () => {
	it('creates canvas', () => {
		const canvasApp = new CanvasApp({ width: 1024, height: 768 });
		const canvas = canvasApp.domElement;
		assert.ok(canvas instanceof MockCanvas);
		assert.strictEqual(canvas.width, 1024);
		assert.strictEqual(canvas.height, 768);
	});
});

const spyTurtle = (turtle) => {
	const events = [];
	['onLine'].forEach(meth => {
		turtle[meth] = (...args) => {
			events.push([meth, ...args]);
		};
	});
	return events;
};

describe('Turtle', () => {
	it('lines', () => {
		const turtle = new Turtle();
		const events = spyTurtle(turtle);

		turtle.forward(10);
		turtle.forward(10);
		turtle.turn(Math.PI * 0.5);
		turtle.forward(1);
		turtle.flush();
		assert.deepStrictEqual(events, [
			['onLine', {x: 0, y: 0}, {x: 10, y: 0}],
			['onLine', {x: 10, y: 0}, {x: 20, y: 0}],
			['onLine', {x: 20, y: 0}, {x: 20, y: 1}],
		]);
	});
});

describe('Shape', () => {
	it('has initial position, scale, rotation', () => {
		const shape = new Shape();
		assert.deepStrictEqual(shape.position, {x: 0, y: 0});
		assert.deepStrictEqual(shape.scale, {x: 1, y: 1});
		assert.deepStrictEqual(shape.rotation, 0);
	});

	it('assigns position in constructor when arg is given', () => {
		const shape = new Shape(null, {x: 123, y: 456});
		assert.deepStrictEqual(shape.position, {x: 123, y: 456});
	});
	it('has children array', () => {
		const shape = new Shape();
		assert.deepStrictEqual(shape.children, []);
	});
});