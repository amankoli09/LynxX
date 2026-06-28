# WebGL Light Rays

The StellarFlow landing page features an interactive WebGL light-rays background rendered via the `ogl` library with custom GLSL shaders.

---

## Overview

**Component:** `src/components/LightRays.js`
**Renderer:** [OGL](https://github.com/oframe/ogl) — a minimal WebGL library (~17 KB gzipped)
**Effect:** Mouse-interactive luminous light beams emanating from a central point on a dark canvas

---

## How It Works

1. A `<canvas>` element is mounted behind the page content with `position: fixed; z-index: 0`.
2. OGL creates a WebGL rendering context on this canvas.
3. A full-screen **triangle mesh** (two triangles covering the viewport) is rendered.
4. A **custom fragment shader** draws the light-rays effect:
   - Ray directions are computed from a configurable set of angles.
   - Each ray's intensity falls off with distance from the source.
   - The mouse position updates a `uMouse` uniform, causing the light source to subtly track cursor movement.
5. The animation loop runs at 60fps via `requestAnimationFrame`.

---

## Key GLSL Concepts

```glsl
// Fragment shader (simplified)
uniform vec2 uMouse;      // Mouse position in NDC (-1 to 1)
uniform float uTime;      // Elapsed time for animation

void main() {
  vec2 uv = vUv - uMouse; // Offset UV from mouse position
  float angle = atan(uv.y, uv.x);
  float dist = length(uv);

  // Ray detection: check if angle aligns with ray directions
  float ray = smoothstep(0.02, 0.0, mod(angle + uTime * 0.1, 0.4));
  float intensity = ray / (dist * 3.0 + 0.5);

  gl_FragColor = vec4(vec3(0.48, 0.36, 0.98) * intensity, 1.0);
}
```

---

## Performance Characteristics

| Property | Value |
|---|---|
| Canvas size | Full viewport (resizes with window) |
| GPU draw calls | 1 per frame (single mesh) |
| CPU overhead | Minimal — mouse position update only |
| Frame rate | 60fps on modern hardware |
| Fallback | Canvas is hidden if WebGL not supported |

---

## Props

`LightRays.js` accepts optional configuration props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `rayCount` | `number` | `8` | Number of light rays |
| `speed` | `number` | `1.0` | Animation speed multiplier |
| `color` | `string` | `"#7c5cfc"` | Ray colour in hex |
| `intensity` | `number` | `0.8` | Ray brightness (0–1) |
| `followMouse` | `bool` | `true` | Whether rays follow cursor |

---

## Mouse Interaction

The mouse position is tracked via a `mousemove` event listener and passed to the shader as a uniform:

```js
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  program.uniforms.uMouse.value = [x, y];
});
```

---

## Cleanup

On component unmount, the animation loop is cancelled and the WebGL context is cleaned up:

```js
useEffect(() => {
  let animId;
  const loop = () => {
    animId = requestAnimationFrame(loop);
    renderer.render({ scene, camera });
  };
  loop();
  return () => {
    cancelAnimationFrame(animId);
    renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}, []);
```
