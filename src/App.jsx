import { useEffect, useRef } from "react";
import { makeNoise2D } from "open-simplex-noise";

function LEDCanvas() {
	const canvasRef = useRef(null);
	const pointerRef = useRef({ x: -9999, y: -9999 });
	const noise2D = useRef(makeNoise2D(Date.now())).current;
	const radius = 150;

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		// LED cell + spacing
		const ledWidth = 7.5;
		const ledHeight = 17.5;
		const spacingX = 10;
		const spacingY = 2.5;
		let leds = [];

		// build / rebuild grid on resize
		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			const cols = Math.floor(canvas.width / (ledWidth + spacingX));
			const rows = Math.floor(canvas.height / (ledHeight + spacingY));
			leds = [];
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					leds.push({
						x: x * (ledWidth + spacingX),
						y: y * (ledHeight + spacingY),
						intensity: 0,
						targetIntensity: 0,
					});
				}
			}
		}
		window.addEventListener("resize", resize);
		resize();

		// pointer tracking
		function updatePointer(e) {
			if (e.touches && e.touches[0]) {
				pointerRef.current = {
					x: e.touches[0].clientX,
					y: e.touches[0].clientY,
				};
			} else {
				pointerRef.current = {
					x: e.clientX,
					y: e.clientY,
				};
			}
		}
		function clearPointer() {
			pointerRef.current = { x: -9999, y: -9999 };
		}
		window.addEventListener("mousemove", updatePointer);
		window.addEventListener("mouseleave", clearPointer);
		window.addEventListener("touchmove", updatePointer, { passive: true });
		window.addEventListener("touchend", clearPointer, { passive: true });

		// render loop
		let rafId;
		let lastUpdate = 0;

		function render(now) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const time = now * 0.001;
			const { x: px, y: py } = pointerRef.current;

			// Update target intensities at lower FPS
			if (now - lastUpdate > 75) {
				for (const led of leds) {
					const dx = led.x - px;
					const dy = led.y - py;
					const dist = Math.hypot(dx, dy);

					const noise = noise2D(led.x * 0.01 + time, led.y * 0.01 + time);
					const adjustedDist = dist - noise * 40;
					led.targetIntensity = Math.max(0, 1 - adjustedDist / radius);
				}
				lastUpdate = now;
			}

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const led of leds) {
				// Interpolate intensity toward target
				led.intensity += (led.targetIntensity - led.intensity) * 0.1;

				ctx.beginPath();
				ctx.fillStyle = `rgba(255,67,6,${led.intensity})`;
				ctx.roundRect(led.x, led.y, ledWidth, ledHeight, 2);
				ctx.fill();
			}

			rafId = requestAnimationFrame(render);
		}
		rafId = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", updatePointer);
			window.removeEventListener("mouseleave", clearPointer);
			window.removeEventListener("touchmove", updatePointer);
			window.removeEventListener("touchend", clearPointer);
		};
	}, []);

	return <canvas ref={canvasRef} className="fixed top-0 -z-10 bg-black" />;
}

export default function App() {
	return (
		<>
			<h1 className="h-50 text-white text-8xl">Scroll</h1>
			<h1 className="h-50 text-white text-8xl">Scroll</h1>
			<h1 className="h-50 text-white text-8xl">Scroll</h1>
			<h1 className="h-50 text-white text-8xl">Scroll</h1>
			<h1 className="h-50 text-white text-8xl">Scroll</h1>
			<h1 className="h-50 text-white text-8xl">Scroll</h1>
			<h1 className="h-50 text-white text-8xl">Scroll</h1>
			<LEDCanvas />
			{/* your site content */}
		</>
	);
}
