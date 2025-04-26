# LED Matrix Prototype

An interactive LED matrix effect using HTML canvas, pointer tracking, and OpenSimplex noise. Each "LED" responds to pointer movement with glowing intensity and dynamic noise-based variations.

---

## Features

- **Canvas-based** LED matrix for high performance
- **Interactive glow** based on mouse/touch position
- **Noise-based flicker** using `open-simplex-noise`
- **Smooth animation** with requestAnimationFrame
- **Responsive grid** that adapts on window resize

---

## Technologies Used

- React
- HTML5 Canvas API
- OpenSimplex Noise (`open-simplex-noise`)

---

## How It Works

- The canvas is filled with a grid of rounded rectangles ("LEDs").
- Each LED calculates its distance from the pointer and combines it with a noise factor.
- Intensity fades in and out smoothly, interpolating toward a target value.
- The pointer can be a mouse or a touch position.

---

## Getting Started

### Install dependencies

```bash
npm install open-simplex-noise