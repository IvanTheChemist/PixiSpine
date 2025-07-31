# PixiJS Spine Demo

[![CI/CD Pipeline](https://github.com/IvanTheChemist/PixiSpine/actions/workflows/ci.yml/badge.svg)](https://github.com/IvanTheChemist/PixiSpine/actions/workflows/ci.yml)
[![PR Status Checks](https://github.com/IvanTheChemist/PixiSpine/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/IvanTheChemist/PixiSpine/actions/workflows/pr-checks.yml)
[![Test Coverage](https://img.shields.io/badge/coverage-90%2B-brightgreen)](https://github.com/IvanTheChemist/PixiSpine/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A demo application showcasing Spine 3 animations with PixiJS and webpack.

## 🚀 Features

- PixiJS 7.3.0 for WebGL rendering
- Pixi-Spine 4.0.4 for Spine animation support
- Webpack 5 for bundling and development server
- Responsive design
- Interactive animation controls
- FPS counter and status display
- Placeholder character with multiple animations (idle, walk, run, jump)
- **Comprehensive test suite with 90%+ coverage**
- **Automated CI/CD pipeline with GitHub Actions**
- **Quality gates and PR status checks**

## 🏗️ Development Workflow

This project uses a robust CI/CD pipeline with the following quality gates:

### Pull Requests

- ✅ All tests must pass
- ✅ Code coverage must meet 70% threshold
- ✅ Build must complete successfully
- ✅ No merge conflicts
- ✅ Automated PR status checks
- ✅ Bundle size impact analysis

### Releases

- 🚀 Automatic releases on merge to `main`
- 📦 Build artifacts attached to releases
- 🌐 Automatic deployment to GitHub Pages
- 📝 Auto-generated changelogs

## 🛠️ Getting Started

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
  "assets/your-character.json",
  "assets/your-character.atlas",
]);

this.spine = new Spine(spineData);
```

## Controls

- **Idle**: Play idle animation
- **Walk**: Play walking animation
- **Run**: Play running animation
- **Jump**: Play jumping animation
- **Scale +/-**: Increase/decrease character size

## 🧪 Testing

This project includes comprehensive test coverage with industry best practices:

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

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
```

### Test Coverage

Current coverage metrics:

- **Lines**: 90%+
- **Functions**: 90%+
- **Branches**: 90%+
- **Statements**: 90%+

## 🤝 Contributing

We welcome contributions! Please follow our contribution guidelines:

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes with proper tests
4. **Ensure** all tests pass: `npm test`
5. **Verify** coverage meets requirements: `npm run test:coverage`
6. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
7. **Push** to the branch: `git push origin feature/amazing-feature`
8. **Create** a Pull Request

### Quality Requirements

All PRs must pass these automated checks:

- ✅ All tests passing
- ✅ Coverage above 70% threshold
- ✅ Successful build
- ✅ No merge conflicts
- ✅ PR template completed

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests during development
npm run test:watch
```

## 📈 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

- **CI Pipeline** (`ci.yml`): Runs on all pushes and PRs

  - Multi-Node.js version testing (18.x, 20.x)
  - Automated testing and coverage reporting
  - Build verification
  - Security auditing

- **PR Status Checks** (`pr-checks.yml`): Quality gates for PRs

  - Comprehensive test validation
  - Coverage threshold verification
  - Bundle size impact analysis
  - Automated PR status comments

- **Release & Deploy** (`release.yml`): Automated releases
  - Automatic versioning and tagging
  - GitHub Pages deployment
  - Release notes generation
  - Asset publishing

### Branch Protection

The `main` branch is protected with these requirements:

- PR reviews required
- Status checks must pass
- No direct pushes allowed
- Force pushes disabled

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PixiJS](https://pixijs.com/) - 2D WebGL renderer
- [Pixi-Spine](https://github.com/pixijs/spine) - Spine runtime for PixiJS
- [Esoteric Software](http://esotericsoftware.com/) - Spine 2D animation software

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
