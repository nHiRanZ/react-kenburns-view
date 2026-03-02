# react-kenburns-view

[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg)](http://opensource.org/licenses/ISC)
[![npm](https://img.shields.io/badge/npm-react--kenburns--view-red)](https://www.npmjs.com/package/react-kenburns-view)
[![Website](https://img.shields.io/badge/website-nimila.online-blue)](https://nimila.online)

## About

[**Ken Burns effect**](https://en.wikipedia.org/wiki/Ken_Burns_effect)—slow zoom and pan over still images—for **React web** applications. Drop in a component, pass an image URL and size, and get smooth motion for heroes, galleries, or slideshows.

**Lightweight:** No animation library. Uses CSS transforms and `requestAnimationFrame`. Each instance uses randomized timing and pan direction so multiple images don’t move in lockstep.

For React Native, see [react-native-kenburns-view](https://github.com/nHiRanZ/react-native-kenburns-view).

## Installation

```bash
npm install react-kenburns-view
```

**Peer dependencies:** React 17+ and React DOM 17+.

## Demo

Run the demo app (Vite + React) from the `demo` folder:

```bash
cd demo
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Usage

```jsx
import KenBurnsView from 'react-kenburns-view';

function Hero() {
  return (
    <KenBurnsView
      width={1200}
      height={600}
      src="https://example.com/photo.jpg"
      alt="Hero"
      duration={15000}
      zoomStart={1}
      zoomEnd={1.2}
      panX={0.08}
      panY={0.08}
    />
  );
}
```

## API (props)

| Prop          | Type     | Required | Description |
|---------------|----------|----------|-------------|
| **`width`**   | `number` | Yes      | Container width (px). |
| **`height`**  | `number` | Yes      | Container height (px). |
| **`src`**     | `string` | Yes      | Image URL. |
| **`alt`**     | `string` | No       | Alt text for the image. |
| **`placeholder`** | `string` | No    | Placeholder image URL (optional). |
| **`autoStart`**  | `boolean` | No   | Start animation on mount. Default: `true`. |
| **`duration`**   | `number` | No   | Full cycle duration (ms). Default: `20000`. |
| **`zoomStart`**  | `number` | No   | Start scale. Default: `1`. |
| **`zoomEnd`**    | `number` | No   | End scale. Default: `1.3`. |
| **`panX`**       | `number` | No   | Horizontal pan (fraction of width). Default: `0.1`. |
| **`panY`**       | `number` | No   | Vertical pan (fraction of height). Default: `0.1`. |
| **`className`**  | `string` | No   | CSS class for the outer container. |
| **`style`**     | `object` | No   | Inline styles for the outer container. |
| **`children`**  | `node`  | No   | Rendered inside the image layer. |

## Ref API

You can control the animation via a ref:

```jsx
const ref = useRef();

// Start (or restart) the animation
ref.current?.start();

// Stop the animation
ref.current?.stop();

// Stop and reset progress to 0
ref.current?.reset();
```

## License

[ISC](http://opensource.org/licenses/ISC)

## Feedback

Website: [nimila.online](https://nimila.online)  
Email: nimilahiran@gmail.com  
X/Twitter: [@nHiRanZ](https://twitter.com/nHiRanZ)
