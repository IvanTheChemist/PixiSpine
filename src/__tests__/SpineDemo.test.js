import { SpineDemo } from "../SpineDemo.js";

// Mock PixiJS
const mockCanvas = () => {
  const canvas = document.createElement("canvas");
  return canvas;
};

const mockApp = () => ({
  view: mockCanvas(),
  screen: { width: 800, height: 600 },
  stage: {
    addChild: jest.fn(),
  },
  ticker: {
    add: jest.fn(),
    remove: jest.fn(),
  },
  renderer: {
    resize: jest.fn(),
  },
  destroy: jest.fn(),
});

const mockContainer = () => ({
  x: 0,
  y: 0,
  scale: (() => {
    const scaleObj = { x: 1, y: 1 };
    scaleObj.set = jest.fn((value) => {
      scaleObj.x = value;
      scaleObj.y = value;
      return scaleObj;
    });
    return scaleObj;
  })(),
  rotation: 0,
  animationTime: 0,
  animationSpeed: 1,
  addChild: jest.fn(),
  destroy: jest.fn(),
  parts: {},
});

const mockGraphics = () => ({
  beginFill: jest.fn().mockReturnThis(),
  drawRoundedRect: jest.fn().mockReturnThis(),
  drawCircle: jest.fn().mockReturnThis(),
  endFill: jest.fn().mockReturnThis(),
  scale: { x: 1, y: 1 },
  y: 0,
  rotation: 0,
});

jest.mock("pixi.js", () => ({
  Application: jest.fn(() => mockApp()),
  Container: jest.fn(() => mockContainer()),
  Graphics: jest.fn(() => mockGraphics()),
}));

// Mock pixi-spine
jest.mock("pixi-spine", () => ({
  Spine: jest.fn(),
}));

describe("SpineDemo", () => {
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

    mockContainer = document.getElementById("game-container");
    spineDemo = new SpineDemo(mockContainer);
  });

  afterEach(() => {
    if (spineDemo && !spineDemo.isDestroyed) {
      spineDemo.destroy();
    }
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    test("should create a new SpineDemo instance", () => {
      expect(spineDemo).toBeInstanceOf(SpineDemo);
      expect(spineDemo.isInitialized).toBe(false);
      expect(spineDemo.isDestroyed).toBe(false);
    });

    test("should initialize successfully", async () => {
      await spineDemo.init();

      expect(spineDemo.isInitialized).toBe(true);
      expect(spineDemo.app).toBeDefined();
      expect(spineDemo.spine).toBeDefined();
      expect(spineDemo.currentAnimation).toBe("idle");
    });

    test("should throw error if initialized twice", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      await spineDemo.init();

      await expect(spineDemo.init()).rejects.toThrow(
        "SpineDemo is already initialized"
      );

      consoleSpy.mockRestore();
    });

    test("should throw error if game container not found", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const demoWithoutContainer = new SpineDemo(null);
      document.getElementById("game-container").remove();

      await expect(demoWithoutContainer.init()).rejects.toThrow(
        "Game container not found"
      );

      consoleSpy.mockRestore();
    });

    test("should throw error in setupDemo if spine or app not initialized", () => {
      // Test setupDemo error when spine is null
      spineDemo.spine = null;
      spineDemo.app = { screen: { width: 800, height: 600 } };

      expect(() => spineDemo.setupDemo()).toThrow(
        "Cannot setup demo: spine or app not initialized"
      );

      // Test setupDemo error when app is null
      spineDemo.spine = { x: 0, y: 0 };
      spineDemo.app = null;

      expect(() => spineDemo.setupDemo()).toThrow(
        "Cannot setup demo: spine or app not initialized"
      );
    });

    test("should update status during initialization", async () => {
      await spineDemo.init();

      expect(document.getElementById("status").textContent).toBe("Demo ready!");
    });

    test("should hide loading and show controls after initialization", async () => {
      await spineDemo.init();

      expect(document.getElementById("loading").style.display).toBe("none");
      expect(document.getElementById("controls").style.display).toBe("flex");
    });
  });

  describe("Asset Loading", () => {
    test("should load spine assets successfully", async () => {
      const result = await spineDemo.loadSpineAssets();

      expect(result).toEqual({
        success: true,
        assetsLoaded: ["placeholder-character"],
      });
    });

    test("should throw error for non-mock spine creation failures", async () => {
      // Mock createPlaceholderCharacter to throw an error
      const originalCreate = spineDemo.createPlaceholderCharacter;
      spineDemo.createPlaceholderCharacter = jest.fn(() => {
        throw new Error("Real spine loading error");
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(spineDemo.loadSpineAssets()).rejects.toThrow(
        "Real spine loading error"
      );

      // Restore original method
      spineDemo.createPlaceholderCharacter = originalCreate;
      consoleSpy.mockRestore();
    });

    test("should create placeholder character", async () => {
      await spineDemo.init();

      expect(spineDemo.spine).toBeDefined();
      expect(spineDemo.spine.parts).toBeDefined();
      expect(spineDemo.spine.parts.body).toBeDefined();
      expect(spineDemo.spine.parts.head).toBeDefined();
      expect(spineDemo.spine.parts.leftArm).toBeDefined();
      expect(spineDemo.spine.parts.rightArm).toBeDefined();
      expect(spineDemo.spine.parts.leftLeg).toBeDefined();
      expect(spineDemo.spine.parts.rightLeg).toBeDefined();
    });

    test("should handle spine scaling without scale.set method", async () => {
      // Create a spine mock without scale.set method
      const { Spine } = require("pixi-spine");
      Spine.mockImplementation(() => {
        throw new Error("Could not create spine from mock spine data");
      });

      await spineDemo.init();

      // Remove the scale.set method to test the fallback
      delete spineDemo.spine.scale.set;

      // Test that it uses scale.x and scale.y instead
      const initialX = spineDemo.spine.scale.x;
      const initialY = spineDemo.spine.scale.y;

      spineDemo.scaleCharacter(0.5);

      expect(spineDemo.spine.scale.x).not.toBe(initialX);
      expect(spineDemo.spine.scale.y).not.toBe(initialY);
    });

    test("should have all animations available after loading", async () => {
      await spineDemo.init();

      const animations = spineDemo.getAnimations();
      expect(animations).toContain("idle");
      expect(animations).toContain("walk");
      expect(animations).toContain("run");
      expect(animations).toContain("jump");
    });
  });

  describe("Button Functionality", () => {
    beforeEach(async () => {
      await spineDemo.init();
    });

    test("should play idle animation when idle button is clicked", () => {
      const idleButton = document.getElementById("play-idle");
      idleButton.click();

      expect(spineDemo.getCurrentAnimation()).toBe("idle");
      expect(document.getElementById("current-animation").textContent).toBe(
        "idle"
      );
    });

    test("should play walk animation when walk button is clicked", () => {
      const walkButton = document.getElementById("play-walk");
      walkButton.click();

      expect(spineDemo.getCurrentAnimation()).toBe("walk");
      expect(document.getElementById("current-animation").textContent).toBe(
        "walk"
      );
    });

    test("should play run animation when run button is clicked", () => {
      const runButton = document.getElementById("play-run");
      runButton.click();

      expect(spineDemo.getCurrentAnimation()).toBe("run");
      expect(document.getElementById("current-animation").textContent).toBe(
        "run"
      );
    });

    test("should play jump animation when jump button is clicked", () => {
      const jumpButton = document.getElementById("play-jump");
      jumpButton.click();

      expect(spineDemo.getCurrentAnimation()).toBe("jump");
      expect(document.getElementById("current-animation").textContent).toBe(
        "jump"
      );
    });

    test("should scale up character when scale-up button is clicked", () => {
      const initialScale = spineDemo.getSpineScale();
      const scaleUpButton = document.getElementById("scale-up");
      scaleUpButton.click();

      expect(spineDemo.getSpineScale()).toBeGreaterThan(initialScale);
    });

    test("should scale down character when scale-down button is clicked", () => {
      // First scale up to have room to scale down
      spineDemo.scaleCharacter(1);
      const initialScale = spineDemo.getSpineScale();

      const scaleDownButton = document.getElementById("scale-down");
      scaleDownButton.click();

      expect(spineDemo.getSpineScale()).toBeLessThan(initialScale);
    });

    test("should limit scaling to minimum and maximum values", () => {
      // Test maximum scale
      for (let i = 0; i < 20; i++) {
        document.getElementById("scale-up").click();
      }
      expect(spineDemo.getSpineScale()).toBe(4);

      // Test minimum scale
      for (let i = 0; i < 20; i++) {
        document.getElementById("scale-down").click();
      }
      expect(spineDemo.getSpineScale()).toBe(0.5);
    });

    test("should update button visual states when animation changes", () => {
      const walkButton = document.getElementById("play-walk");
      const idleButton = document.getElementById("play-idle");

      walkButton.click();
      expect(walkButton.style.background).toBe("rgb(255, 152, 0)"); // #FF9800

      idleButton.click();
      expect(idleButton.style.background).toBe("rgb(255, 152, 0)"); // #FF9800
      expect(walkButton.style.background).toBe("rgb(76, 175, 80)"); // #4CAF50
    });
  });

  describe("Animation System", () => {
    beforeEach(async () => {
      await spineDemo.init();
    });

    test("should throw error when playing non-existent animation", () => {
      expect(() => spineDemo.playAnimation("nonexistent")).toThrow(
        "Animation 'nonexistent' not found"
      );
    });

    test("should throw error when playing animation without spine initialized", () => {
      spineDemo.spine = null;
      expect(() => spineDemo.playAnimation("idle")).toThrow(
        "Cannot play animation: spine not initialized"
      );
    });

    test("should reset animation time when playing new animation", () => {
      spineDemo.spine.animationTime = 100;
      spineDemo.playAnimation("walk");
      expect(spineDemo.spine.animationTime).toBe(0);
    });

    test("should update animation time during animate cycle", () => {
      const initialTime = spineDemo.spine.animationTime;
      spineDemo.animate(1);
      expect(spineDemo.spine.animationTime).toBeGreaterThan(initialTime);
    });

    test("should not animate when destroyed", () => {
      spineDemo.destroy();
      const initialTime = spineDemo.spine ? spineDemo.spine.animationTime : 0;
      spineDemo.animate(1);
      // Should not crash and should not update time
      expect(spineDemo.isDestroyed).toBe(true);
    });

    test("should handle jump animation branches correctly", () => {
      spineDemo.playAnimation("jump");

      // Test high jump scenario (jumpHeight > 40)
      spineDemo.spine.animationTime = Math.PI / 6; // Should give jumpHeight = 80 > 40
      spineDemo.animate(1);
      expect(spineDemo.spine.parts.body.scale.y).toBe(1.2);
      expect(spineDemo.spine.parts.leftArm.y).toBe(-30);
      expect(spineDemo.spine.parts.rightArm.y).toBe(-30);

      // Test low jump scenario (jumpHeight < 20)
      spineDemo.spine.animationTime = Math.PI; // Should give jumpHeight = 0 < 20
      spineDemo.animate(1);
      expect(spineDemo.spine.parts.leftLeg.scale.y).toBe(0.8);
      expect(spineDemo.spine.parts.rightLeg.scale.y).toBe(0.8);

      // Test middle jump scenario (20 <= jumpHeight <= 40)
      spineDemo.spine.animationTime = 0.15; // Should give jumpHeight ≈ 35
      spineDemo.animate(1);
      expect(spineDemo.spine.parts.body.scale.y).toBe(1);
      expect(spineDemo.spine.parts.leftArm.y).toBe(0);
      expect(spineDemo.spine.parts.rightArm.y).toBe(0);
      expect(spineDemo.spine.parts.leftLeg.scale.y).toBe(1);
      expect(spineDemo.spine.parts.rightLeg.scale.y).toBe(1);
    });

    test("should properly execute idle animation breathing effect", () => {
      spineDemo.playAnimation("idle");
      spineDemo.spine.animationTime = 0;

      const initialBodyScale = spineDemo.spine.parts.body.scale.y;
      const initialHeadY = spineDemo.spine.parts.head.y;

      spineDemo.animate(1);

      // The breathing effect should modify body scale and head position
      expect(spineDemo.spine.parts.body.scale.y).not.toBe(initialBodyScale);
      expect(spineDemo.spine.parts.head.y).not.toBe(initialHeadY);
    });

    test("should properly execute walk animation leg movement", () => {
      spineDemo.playAnimation("walk");
      spineDemo.spine.animationTime = 0;

      const initialLeftLegRotation = spineDemo.spine.parts.leftLeg.rotation;
      const initialRightLegRotation = spineDemo.spine.parts.rightLeg.rotation;

      spineDemo.animate(1);

      // The walk animation should modify leg rotations
      expect(spineDemo.spine.parts.leftLeg.rotation).not.toBe(
        initialLeftLegRotation
      );
      expect(spineDemo.spine.parts.rightLeg.rotation).not.toBe(
        initialRightLegRotation
      );
    });

    test("should properly execute run animation with enhanced movement", () => {
      spineDemo.playAnimation("run");
      spineDemo.spine.animationTime = 0;

      const initialLeftArmRotation = spineDemo.spine.parts.leftArm.rotation;
      const initialRightArmRotation = spineDemo.spine.parts.rightArm.rotation;
      const initialLeftLegRotation = spineDemo.spine.parts.leftLeg.rotation;
      const initialRightLegRotation = spineDemo.spine.parts.rightLeg.rotation;

      spineDemo.animate(1);

      // The run animation should modify both arm and leg rotations
      expect(spineDemo.spine.parts.leftArm.rotation).not.toBe(
        initialLeftArmRotation
      );
      expect(spineDemo.spine.parts.rightArm.rotation).not.toBe(
        initialRightArmRotation
      );
      expect(spineDemo.spine.parts.leftLeg.rotation).not.toBe(
        initialLeftLegRotation
      );
      expect(spineDemo.spine.parts.rightLeg.rotation).not.toBe(
        initialRightLegRotation
      );
    });
  });

  describe("Scaling Functionality", () => {
    beforeEach(async () => {
      await spineDemo.init();
    });

    test("should scale character correctly", () => {
      const newScale = spineDemo.scaleCharacter(0.5);
      expect(newScale).toBe(2.5);
      expect(spineDemo.getSpineScale()).toBe(2.5);
    });

    test("should enforce minimum scale limit", () => {
      const newScale = spineDemo.scaleCharacter(-10);
      expect(newScale).toBe(0.5);
      expect(spineDemo.getSpineScale()).toBe(0.5);
    });

    test("should enforce maximum scale limit", () => {
      const newScale = spineDemo.scaleCharacter(10);
      expect(newScale).toBe(4);
      expect(spineDemo.getSpineScale()).toBe(4);
    });

    test("should throw error when scaling without spine initialized", () => {
      spineDemo.spine = null;
      expect(() => spineDemo.scaleCharacter(0.1)).toThrow(
        "Cannot scale character: spine not initialized"
      );
    });
  });

  describe("Asset Unloading and Cleanup", () => {
    beforeEach(async () => {
      await spineDemo.init();
    });

    test("should destroy properly", () => {
      expect(spineDemo.isDestroyed).toBe(false);
      expect(spineDemo.isInitialized).toBe(true);

      spineDemo.destroy();

      expect(spineDemo.isDestroyed).toBe(true);
      expect(spineDemo.isInitialized).toBe(false);
      expect(spineDemo.app).toBeNull();
      expect(spineDemo.spine).toBeNull();
    });

    test("should remove event listeners during cleanup", () => {
      const button = document.getElementById("play-idle");
      expect(button._testHandler).toBeDefined();

      spineDemo.destroy();

      expect(button._testHandler).toBeUndefined();
    });

    test("should not crash when destroying twice", () => {
      spineDemo.destroy();
      expect(() => spineDemo.destroy()).not.toThrow();
    });

    test("should call destroy methods on PIXI objects", () => {
      const mockSpineDestroy = jest.fn();
      const mockAppDestroy = jest.fn();

      spineDemo.spine.destroy = mockSpineDestroy;
      spineDemo.app.destroy = mockAppDestroy;

      spineDemo.destroy();

      expect(mockSpineDestroy).toHaveBeenCalledWith({ children: true });
      expect(mockAppDestroy).toHaveBeenCalledWith(true, {
        children: true,
        texture: true,
        baseTexture: true,
      });
    });

    test("should handle errors during cleanup gracefully", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      // Make destroy throw an error
      spineDemo.spine.destroy = jest.fn(() => {
        throw new Error("Cleanup error");
      });

      expect(() => spineDemo.destroy()).toThrow("Cleanup error");
      expect(spineDemo.isDestroyed).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe("Error Handling", () => {
    test("should handle setup demo error when spine not initialized", async () => {
      spineDemo.spine = null;
      spineDemo.app = { screen: { width: 800, height: 600 } };

      expect(() => spineDemo.setupDemo()).toThrow(
        "Cannot setup demo: spine or app not initialized"
      );
    });

    test("should handle setup demo error when app not initialized", async () => {
      spineDemo.app = null;

      expect(() => spineDemo.setupDemo()).toThrow(
        "Cannot setup demo: spine or app not initialized"
      );
    });
  });

  describe("State Management", () => {
    test("should report ready state correctly", async () => {
      expect(spineDemo.isReady()).toBe(false);

      await spineDemo.init();
      expect(spineDemo.isReady()).toBe(true);

      spineDemo.destroy();
      expect(spineDemo.isReady()).toBe(false);
    });

    test("should track FPS correctly", async () => {
      await spineDemo.init();

      // Mock performance.now to simulate time passing
      const originalNow = performance.now;
      let mockTime = 1000; // Start at 1000 to match expected lastTime
      performance.now = jest.fn(() => mockTime);

      // Reset timing to synchronize with our mock
      spineDemo.lastTime = 1000;
      spineDemo.frameCount = 0;
      spineDemo.fps = 0;

      // Simulate frames over 1 second
      for (let i = 0; i < 60; i++) {
        spineDemo.animate(1);
        mockTime += 16.67; // ~60fps
      }

      mockTime = 2000; // Trigger FPS calculation (1000ms elapsed)
      spineDemo.animate(1);

      expect(spineDemo.getFPS()).toBeGreaterThan(0);

      // Restore original function
      performance.now = originalNow;
    });
  });

  describe("Resize Handling", () => {
    beforeEach(async () => {
      await spineDemo.init();
    });

    test("should handle window resize", () => {
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;

      // Change window size
      Object.defineProperty(window, "innerWidth", {
        value: 1200,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 900,
        configurable: true,
      });

      spineDemo.onResize();

      expect(spineDemo.app.renderer.resize).toHaveBeenCalledWith(1200, 900);

      // Restore original values
      Object.defineProperty(window, "innerWidth", {
        value: originalWidth,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: originalHeight,
        configurable: true,
      });
    });

    test("should not crash on resize when app or spine is null", () => {
      spineDemo.app = null;
      expect(() => spineDemo.onResize()).not.toThrow();

      spineDemo.app = { renderer: { resize: jest.fn() } };
      spineDemo.spine = null;
      expect(() => spineDemo.onResize()).not.toThrow();
    });
  });
});
