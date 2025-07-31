import { SpineDemo } from '../SpineDemo.js';

describe('SpineDemo Integration Tests', () => {
  let spineDemo;

  beforeEach(() => {
    // Setup DOM elements that match the actual HTML structure
    document.body.innerHTML = `
      <div id="game-container"></div>
      <div class="loading" id="loading">Loading Spine Demo...</div>
      <div class="ui-overlay" id="info">
        <h3>PixiJS Spine Demo</h3>
        <p>Status: <span id="status">Initializing...</span></p>
        <p>Animation: <span id="current-animation">None</span></p>
        <p>FPS: <span id="fps">0</span></p>
      </div>
      <div class="controls" id="controls" style="display: none;">
        <button id="play-idle">Idle</button>
        <button id="play-walk">Walk</button>
        <button id="play-run">Run</button>
        <button id="play-jump">Jump</button>
        <button id="scale-up">Scale +</button>
        <button id="scale-down">Scale -</button>
      </div>
    `;
  });

  afterEach(() => {
    if (spineDemo && !spineDemo.isDestroyed) {
      spineDemo.destroy();
    }
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Full Application Flow', () => {
    test('should complete full initialization flow', async () => {
      spineDemo = new SpineDemo();
      
      // Initial state
      expect(spineDemo.isReady()).toBe(false);
      expect(document.getElementById('loading').style.display).not.toBe('none');
      expect(document.getElementById('controls').style.display).toBe('none');
      
      // Initialize
      await spineDemo.init();
      
      // Post-initialization state
      expect(spineDemo.isReady()).toBe(true);
      expect(spineDemo.isInitialized).toBe(true);
      expect(document.getElementById('loading').style.display).toBe('none');
      expect(document.getElementById('controls').style.display).toBe('flex');
      expect(document.getElementById('status').textContent).toBe('Demo ready!');
      expect(document.getElementById('current-animation').textContent).toBe('idle');
    });

    test('should handle complete animation workflow', async () => {
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      const animations = ['idle', 'walk', 'run', 'jump'];
      
      for (const animation of animations) {
        const button = document.getElementById(`play-${animation}`);
        button.click();
        
        expect(spineDemo.getCurrentAnimation()).toBe(animation);
        expect(document.getElementById('current-animation').textContent).toBe(animation);
        expect(button.style.background).toBe('rgb(255, 152, 0)'); // Active state
        
        // Run a few animation frames
        for (let i = 0; i < 5; i++) {
          spineDemo.animate(1);
        }
      }
    });

    test('should handle complete scaling workflow', async () => {
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      const initialScale = spineDemo.getSpineScale();
      const scaleUpButton = document.getElementById('scale-up');
      const scaleDownButton = document.getElementById('scale-down');
      
      // Scale up multiple times
      for (let i = 0; i < 3; i++) {
        scaleUpButton.click();
      }
      expect(spineDemo.getSpineScale()).toBeGreaterThan(initialScale);
      
      // Scale down multiple times
      for (let i = 0; i < 6; i++) {
        scaleDownButton.click();
      }
      expect(spineDemo.getSpineScale()).toBeLessThan(initialScale);
    });

    test('should handle resize during operation', async () => {
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      // Play some animations and resize
      document.getElementById('play-walk').click();
      spineDemo.animate(1);
      
      // Simulate window resize
      Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true });
      
      spineDemo.onResize();
      
      // Should still be functional
      expect(spineDemo.isReady()).toBe(true);
      expect(spineDemo.getCurrentAnimation()).toBe('walk');
      
      // Should be able to continue animations
      spineDemo.animate(1);
      document.getElementById('play-jump').click();
      expect(spineDemo.getCurrentAnimation()).toBe('jump');
    });

    test('should maintain state consistency throughout lifecycle', async () => {
      spineDemo = new SpineDemo();
      
      // Pre-init state
      expect(spineDemo.isInitialized).toBe(false);
      expect(spineDemo.isDestroyed).toBe(false);
      expect(spineDemo.isReady()).toBe(false);
      
      await spineDemo.init();
      
      // Post-init state
      expect(spineDemo.isInitialized).toBe(true);
      expect(spineDemo.isDestroyed).toBe(false);
      expect(spineDemo.isReady()).toBe(true);
      expect(spineDemo.app).toBeTruthy();
      expect(spineDemo.spine).toBeTruthy();
      
      // Operate the demo
      document.getElementById('play-run').click();
      spineDemo.scaleCharacter(0.5);
      spineDemo.animate(1);
      
      // State should remain consistent
      expect(spineDemo.isReady()).toBe(true);
      expect(spineDemo.getCurrentAnimation()).toBe('run');
      
      spineDemo.destroy();
      
      // Post-destroy state
      expect(spineDemo.isInitialized).toBe(false);
      expect(spineDemo.isDestroyed).toBe(true);
      expect(spineDemo.isReady()).toBe(false);
      expect(spineDemo.app).toBeNull();
      expect(spineDemo.spine).toBeNull();
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    test('should handle missing DOM elements gracefully', async () => {
      // Remove some DOM elements
      document.getElementById('fps').remove();
      document.getElementById('current-animation').remove();
      
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      // Should still work without crashing
      expect(spineDemo.isReady()).toBe(true);
      
      document.getElementById('play-walk').click();
      expect(spineDemo.getCurrentAnimation()).toBe('walk');
      
      spineDemo.animate(1);
      // Should not crash when trying to update missing elements
    });

    test('should handle rapid button clicks', async () => {
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      const buttons = ['play-idle', 'play-walk', 'play-run', 'play-jump'];
      
      // Rapidly click buttons
      for (let i = 0; i < 20; i++) {
        const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
        document.getElementById(randomButton).click();
        spineDemo.animate(1);
      }
      
      // Should still be in a valid state
      expect(spineDemo.isReady()).toBe(true);
      expect(['idle', 'walk', 'run', 'jump']).toContain(spineDemo.getCurrentAnimation());
    });

    test('should handle rapid scaling operations', async () => {
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      const scaleUpButton = document.getElementById('scale-up');
      const scaleDownButton = document.getElementById('scale-down');
      
      // Rapidly alternate scaling
      for (let i = 0; i < 50; i++) {
        if (i % 2 === 0) {
          scaleUpButton.click();
        } else {
          scaleDownButton.click();
        }
      }
      
      // Should be within valid scale bounds
      const finalScale = spineDemo.getSpineScale();
      expect(finalScale).toBeGreaterThanOrEqual(0.5);
      expect(finalScale).toBeLessThanOrEqual(4);
      expect(spineDemo.isReady()).toBe(true);
    });

    test('should handle animation with high delta time', async () => {
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      document.getElementById('play-walk').click();
      
      // Simulate very high delta time (like after tab was inactive)
      spineDemo.animate(1000);
      
      expect(spineDemo.isReady()).toBe(true);
      expect(spineDemo.getCurrentAnimation()).toBe('walk');
    });
  });

  describe('Performance and Memory', () => {
    test('should not leak memory through multiple cycles', async () => {
      for (let cycle = 0; cycle < 3; cycle++) {
        spineDemo = new SpineDemo();
        await spineDemo.init();
        
        // Use the demo
        document.getElementById('play-run').click();
        for (let i = 0; i < 10; i++) {
          spineDemo.animate(1);
        }
        document.getElementById('scale-up').click();
        
        expect(spineDemo.isReady()).toBe(true);
        
        spineDemo.destroy();
        expect(spineDemo.isDestroyed).toBe(true);
      }
    });

    test('should handle many animation frames efficiently', async () => {
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      document.getElementById('play-walk').click();
      
      const startTime = performance.now();
      
      // Run many animation frames
      for (let i = 0; i < 1000; i++) {
        spineDemo.animate(1);
      }
      
      const endTime = performance.now();
      
      // Should complete in reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
      expect(spineDemo.isReady()).toBe(true);
    });
  });

  describe('Cross-Browser Compatibility Scenarios', () => {
    test('should work without devicePixelRatio', async () => {
      const originalDPR = window.devicePixelRatio;
      delete window.devicePixelRatio;
      
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      expect(spineDemo.isReady()).toBe(true);
      
      // Restore
      window.devicePixelRatio = originalDPR;
    });

    test('should handle missing performance.now', async () => {
      const originalNow = performance.now;
      delete performance.now;
      
      spineDemo = new SpineDemo();
      await spineDemo.init();
      
      // Should still work (fallback to Date.now in real code)
      expect(spineDemo.isReady()).toBe(true);
      
      // Restore
      performance.now = originalNow;
    });
  });
});
