import { CanvasApp, Shape } from './zulff.js';

const container = document.getElementById('app');

const canvasApp = new CanvasApp({
	width: 1024,
	height: 768,
});

container.appendChild(canvasApp.domElement);

const drawHouse = (turtle) => {
	const size = 30;
	const height = size * 0.6;
	turtle.thickness(2);
	turtle.down();
	turtle.rectangle(size, height);
	turtle.turn(-Math.PI * 0.25);
	turtle.forward(Math.sqrt(2) * size * 0.5);
	turtle.turn(Math.PI * 0.5);
	turtle.forward(Math.sqrt(2) * size * 0.5);
};

canvasApp.root = new Shape((ctx, turtle) => {

	for (let i = 0; i < 10; i++) {
		turtle.thickness(2)
		turtle.color('red');
		turtle.forward(100);
		turtle.turn(Math.PI * 0.75);
		turtle.color('green');
		turtle.thickness(3);
		turtle.forward(100);
		turtle.turn(-Math.PI * 0.55 + t * 0.1 * Math.sqrt(i));
		turtle.up();
		turtle.color('orange');

		turtle.forward(Math.sin(t) * i + 10);
		turtle.down();

		turtle.drawPoint();
	}
}, {x: 150, y: 150});

let t = 0;
const child = new Shape((ctx, turtle) => {
	turtle.color('white');
	turtle.turn(t * 0.3);
	for (let i = 0; i < 5; i++) {
		turtle.thickness(3);
		turtle.turn(0.5);
		turtle.forward(60 + Math.sin(t) * 20);
		turtle.turn(0.7);
		turtle.thickness(1);
		turtle.forward(-40);
	}

}, {x: 100, y: 50});

canvasApp.root.children.push(child);

canvasApp.root.children.push(new Shape((ctx, turtle) => {
	drawHouse(turtle);
}));
canvasApp.render();

setInterval(() => {
	t += 0.05;
	const root = canvasApp.root;
	root.scale.x = Math.sin(t) * 0.5 + 1;
	root.scale.y = Math.sin(t) * 0.5 + 1;
	root.position.x = Math.cos(t * 0.5) * 300 + 400;
	root.children[0].position.y = Math.sin(t * 0.3) * 100;
	root.children[0].scale.y = Math.sin(t * 0.3);
	root.rotation += 0.001;
	canvasApp.render();
}, 20);
