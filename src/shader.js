const canvasSketch = require('canvas-sketch')
const createShader = require('canvas-sketch-util/shader')
const glsl = require('glslify')

// Setup our sketch
const settings = {
	context: 'webgl',
	animate: true,
	duration: 4
}

// Your glsl code
const frag = glsl(/* glsl */ `
  precision highp float;

  uniform float time;
	uniform float aspect;
  varying vec2 vUv;

  void main () {
		vec3 colorA = sin(time) + vec3(sin(time) * 0.1, 0.3, 0.2);
		vec3 colorB = vec3(1.0, sin(time) * 0.1, 0.0);

		vec2 center = vUv - 0.5;
		center.x *= aspect;
		float dist = length(center);

		float alpha = smoothstep(0.25075, 0.25 * sin(time), dist);

		vec3 color = mix(colorA, colorB, vUv.x * vUv.y * sin(time));
		gl_FragColor = vec4(color, alpha);
  }
`)

// Your sketch, which simply returns the shader
const sketch = ({ gl }) =>
	// Create the shader and return it
	createShader({
		clearColor: 'white',
		// Pass along WebGL context
		gl,
		// Specify fragment and/or vertex shader strings
		frag,
		// Specify additional uniforms to pass down to the shaders
		uniforms: {
			// Expose props from canvas-sketch
			time: ({ playhead }) => Math.sin(playhead * Math.PI),

			aspect: ({ width, height }) => width / height
		}
	})

canvasSketch(sketch, settings)
