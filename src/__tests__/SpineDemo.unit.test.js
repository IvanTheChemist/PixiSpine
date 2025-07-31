import { SpineDemo } from '../SpineDemo.js';

describe('SpineDemo Unit Tests', () => {
  let spineDemo;
  let mockContainer;

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <div id="game-container"></div>
      <div id="loading">Loading...</div>
      <div id="controls" style="display: none;">
        <button id="play-idle">Idle</button>
        <button id="play-walk">Walk</button>
        <button id="play-run">Run</button>
        <button id="play-jump">Jump</button>
        <button id="scale-up">Scale +</button>
        <button id="scale-down">Scale -</button>
      </div>
      <span id="status">Initializing...</span>
      <span id="current-animation">None</span>
      <span id="fps">0</span>
    `;

    mockContainer = document.getElementById('game-container');
    spineDemo = new SpineDemo(mockContainer);
  });

  afterEach(() => {
    if (spineDemo && !spineDemo.isDestroyed) {
      try {
        spineDemo.destroy();
      } catch (e) {
        // Ignore cleanup errors in tests
      }
    }
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    test('should create a new SpineDemo instance', () => {
      expect(spineDemo).toBeInstanceOf(SpineDemo);
      expect(spineDemo.isInitialized).toBe(false);
      expect(spineDemo.isDestroyed).toBe(false);
    });

    test('should have correct initial state', () => {
      expect(spineDemo.currentAnimation).toBe('idle');
      expect(spineDemo.fps).toBe(0);
      expect(spineDemo.frameCount).toBe(0);
      expect(spineDemo.container).toBe(mockContainer);
    });

    test('should update status correctly', () => {
      spineDemo.updateStatus('Test status');
      expect(document.getElementById('status').textContent).toBe('Test status');
    });

    test('should handle missing status element gracefully', () => {
      document.getElementById('status').remove();
      expect(() => spineDemo.updateStatus('Test')).not.toThrow();
    });
  });

  describe('Asset Loading Simulation', () => {
    test('should load spine assets successfully', async () => {
      const result = await spineDemo.loadSpineAssets();
      
      expect(result).toEqual({
        success: true,
        assetsLoaded: ['placeholder-character']
      });
    });

    test('should create placeholder character with correct structure', () => {
      const character = spineDemo.createPlaceholderCharacter();
      
      expect(character).toBeDefined();
      expect(character.parts).toBeDefined();
      expect(character.parts.body).toBeDefined();
      expect(character.parts.head).toBeDefined();
      expect(character.parts.leftArm).toBeDefined();
      expect(character.parts.rightArm).toBeDefined();
      expect(character.parts.leftLeg).toBeDefined();
      expect(character.parts.rightLeg).toBeDefined();
    });

    test('should have correct animation properties after character creation', () => {
      const character = spineDemo.createPlaceholderCharacter();
      
      expect(character.animationTime).toBe(0);
      expect(character.animationSpeed).toBe(1);
      expect(spineDemo.animations).toBeDefined();
      expect(Object.keys(spineDemo.animations)).toEqual(['idle', 'walk', 'run', 'jump']);
    });
  });

  describe('Animation Control (without PixiJS)', () => {
    beforeEach(() => {
      // Setup spine object manually for testing
      spineDemo.spine = spineDemo.createPlaceholderCharacter();
    });

    test('should play animation and update current animation', () => {
      expect(() => spineDemo.playAnimation('walk')).not.toThrow();
      expect(spineDemo.getCurrentAnimation()).toBe('walk');
      expect(document.getElementById('current-animation').textContent).toBe('walk');
    });

    test('should reset animation time when playing new animation', () => {
      spineDemo.spine.animationTime = 100;
      spineDemo.playAnimation('run');
      expect(spineDemo.spine.animationTime).toBe(0);
    });

    test('should throw error for non-existent animation', () => {
      expect(() => spineDemo.playAnimation('nonexistent')).toThrow("Animation 'nonexistent' not found");
    });

    test('should throw error when spine not initialized', () => {
      spineDemo.spine = null;
      expect(() => spineDemo.playAnimation('idle')).toThrow('Cannot play animation: spine not initialized');
    });
  });

  describe('Scaling Functions', () => {
    beforeEach(() => {
      spineDemo.spine = spineDemo.createPlaceholderCharacter();
    });

    test('should scale character correctly', () => {
      const newScale = spineDemo.scaleCharacter(0.5);
      expect(newScale).toBe(2.5); // Initial scale is 2
      expect(spineDemo.getSpineScale()).toBe(2.5);
    });

    test('should enforce minimum scale limit', () => {
      const newScale = spineDemo.scaleCharacter(-10);
      expect(newScale).toBe(0.5);
    });

    test('should enforce maximum scale limit', () => {
      const newScale = spineDemo.scaleCharacter(10);
      expect(newScale).toBe(4);
    });

    test('should throw error when scaling without spine', () => {
      spineDemo.spine = null;
      expect(() => spineDemo.scaleCharacter(0.1)).toThrow('Cannot scale character: spine not initialized');
    });
  });

  describe('Button Event Handling', () => {
    beforeEach(() => {
      spineDemo.spine = spineDemo.createPlaceholderCharacter();
      spineDemo.setupControls();
    });

    test('should attach event listeners to buttons', () => {
      const buttons = ['play-idle', 'play-walk', 'play-run', 'play-jump', 'scale-up', 'scale-down'];
      
      buttons.forEach(id => {
        const button = document.getElementById(id);
        expect(button._testHandler).toBeDefined();
      });
    });

    test('should handle button clicks correctly', () => {
      const walkButton = document.getElementById('play-walk');
      walkButton._testHandler();
      
      expect(spineDemo.getCurrentAnimation()).toBe('walk');
    });

    test('should handle scale button clicks', () => {
      const initialScale = spineDemo.getSpineScale();
      
      const scaleUpButton = document.getElementById('scale-up');
      scaleUpButton._testHandler();
      
      expect(spineDemo.getSpineScale()).toBeGreaterThan(initialScale);
    });
  });

  describe('Animation Functions', () => {
    beforeEach(() => {
      spineDemo.spine = spineDemo.createPlaceholderCharacter();
    });

    test('should execute idle animation without errors', () => {
      expect(() => spineDemo.animateIdle(1)).not.toThrow();
    });

    test('should execute walk animation without errors', () => {
      // Need to mock app for walk animation
      spineDemo.app = { screen: { height: 600 } };
      expect(() => spineDemo.animateWalk(1)).not.toThrow();
    });

    test('should execute run animation without errors', () => {
      spineDemo.app = { screen: { height: 600 } };
      expect(() => spineDemo.animateRun(1)).not.toThrow();
    });

    test('should execute jump animation without errors', () => {
      spineDemo.app = { screen: { height: 600 } };
      expect(() => spineDemo.animateJump(1)).not.toThrow();
    });
  });

  describe('State Management', () => {
    test('should report ready state correctly', () => {
      expect(spineDemo.isReady()).toBe(false);
      
      // Manually set up for ready state
      spineDemo.isInitialized = true;
      spineDemo.app = { screen: { width: 800, height: 600 } };
      spineDemo.spine = spineDemo.createPlaceholderCharacter();
      
      expect(spineDemo.isReady()).toBe(true);
    });

    test('should track FPS updates', () => {
      spineDemo.fps = 60;
      expect(spineDemo.getFPS()).toBe(60);
    });

    test('should return available animations', () => {
      spineDemo.createPlaceholderCharacter();
      const animations = spineDemo.getAnimations();
      expect(animations).toEqual(['idle', 'walk', 'run', 'jump']);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing DOM elements in setupControls', () => {
      document.getElementById('play-idle').remove();
      expect(() => spineDemo.setupControls()).not.toThrow();
    });

    test('should handle destroy when already destroyed', () => {
      spineDemo.isDestroyed = true;
      expect(() => spineDemo.destroy()).not.toThrow();
    });

    test('should handle animate when destroyed', () => {
      spineDemo.isDestroyed = true;
      expect(() => spineDemo.animate(1)).not.toThrow();
    });
  });

  describe('Cleanup and Memory Management', () => {
    test('should clean up event listeners on destroy', () => {
      spineDemo.spine = spineDemo.createPlaceholderCharacter();
      spineDemo.setupControls();
      
      const button = document.getElementById('play-idle');
      expect(button._testHandler).toBeDefined();
      
      spineDemo.destroy();
      expect(button._testHandler).toBeUndefined();
    });

    test('should set destroyed state correctly', () => {
      spineDemo.destroy();
      expect(spineDemo.isDestroyed).toBe(true);
      expect(spineDemo.isInitialized).toBe(false);
    });

    test('should clear references on destroy', () => {
      spineDemo.spine = spineDemo.createPlaceholderCharacter();
      spineDemo.animations = { test: () => {} };
      
      spineDemo.destroy();
      
      expect(spineDemo.spine).toBeNull();
      expect(spineDemo.animations).toBeNull();
      expect(spineDemo.elements).toBeNull();
    });
  });
});
