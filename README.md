# PixiJS Spine Demo

A demo application showcasing Spine 3 animations with PixiJS and webpack.

## Features

- PixiJS 7.3.0 for WebGL rendering
- Pixi-Spine 4.0.4 for Spine animation support
- Webpack 5 for bundling and development server
- Responsive design
- Interactive animation controls
- FPS counter and status display
- Placeholder character with multiple animations (idle, walk, run, jump)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd PixiSpine
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

This will start webpack-dev-server on `http://localhost:3000` and automatically open your browser.

### Build for Production

Create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
PixiSpine/
├── src/
│   ├── index.html          # Main HTML template
│   ├── index.js            # Main application entry point
│   └── style.css           # Additional styles
├── dist/                   # Built files (generated)
├── package.json            # Project dependencies and scripts
├── webpack.config.js       # Webpack configuration
└── README.md              # This file
```

## Adding Real Spine Assets

To use real Spine assets instead of the placeholder character:

1. Export your Spine animations with the following files:
   - `.json` or `.skel` (skeleton data)
   - `.atlas` (texture atlas)
   - `.png` (texture images)

2. Place these files in a `src/assets/` directory

3. Load them in `src/index.js`:
```javascript
// Replace the createPlaceholderCharacter() call with:
const spineData = await PIXI.Assets.load([
    'assets/your-character.json',
    'assets/your-character.atlas'
]);

this.spine = new Spine(spineData);
```

## Controls

- **Idle**: Play idle animation
- **Walk**: Play walking animation
- **Run**: Play running animation
- **Jump**: Play jumping animation
- **Scale +/-**: Increase/decrease character size

## Testing

This project includes comprehensive test coverage following industry best practices:

### Test Categories

- **Asset Loading**: Tests for successful loading, character creation, and error handling
- **Button Functionality**: Tests for all interactive controls (animations, scaling)
- **Asset Unloading**: Tests for proper cleanup, memory management, and destroy operations
- **Error Handling**: Tests for edge cases and error recovery
- **State Management**: Tests for application lifecycle and state consistency

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode during development
npm run test:watch
```

### Test Files

- `SpineDemo.unit.test.js` - Unit tests focusing on individual functions
- `SpineDemo.test.js` - Integration tests with mocked PixiJS
- `SpineDemo.integration.test.js` - End-to-end integration tests

See [TESTING.md](TESTING.md) for detailed testing documentation.

## License

MIT License
