require("@testing-library/jest-dom");

// Mock PixiJS Application and related classes
const mockCanvasContext = {
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
};

global.HTMLCanvasElement.prototype.getContext = jest.fn(
  () => mockCanvasContext
);

// Mock WebGL context
const mockWebGLContext = {
  canvas: {},
  drawingBufferWidth: 800,
  drawingBufferHeight: 600,
  getExtension: jest.fn(),
  getParameter: jest.fn(),
  createShader: jest.fn(),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  createProgram: jest.fn(),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  useProgram: jest.fn(),
  createBuffer: jest.fn(),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  createTexture: jest.fn(),
  bindTexture: jest.fn(),
  texImage2D: jest.fn(),
  texParameteri: jest.fn(),
  generateMipmap: jest.fn(),
  viewport: jest.fn(),
  clear: jest.fn(),
  clearColor: jest.fn(),
  enable: jest.fn(),
  blendFunc: jest.fn(),
  drawArrays: jest.fn(),
  drawElements: jest.fn(),
  getUniformLocation: jest.fn(),
  uniform1f: jest.fn(),
  uniform2f: jest.fn(),
  uniform3f: jest.fn(),
  uniform4f: jest.fn(),
  uniformMatrix4fv: jest.fn(),
  getAttribLocation: jest.fn(),
};

global.HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
  if (contextType === "webgl" || contextType === "webgl2") {
    return mockWebGLContext;
  }
  return mockCanvasContext;
});

// Mock PixiJS classes
jest.mock("pixi.js", () => {
  const mockCanvasContext = {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Array(4) })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => []),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
  };

  const mockContainer = {
    addChild: jest.fn(),
    removeChild: jest.fn(),
    destroy: jest.fn(),
    x: 0,
    y: 0,
    rotation: 0,
    scale: {
      x: 1,
      y: 1,
      set: jest.fn((value) => {
        mockContainer.scale.x = value;
        mockContainer.scale.y = value;
        return mockContainer.scale;
      }),
    },
    width: 100,
    height: 100,
    children: [],
    parent: null,
    visible: true,
    interactive: false,
    buttonMode: false,
    hitArea: null,
    pivot: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
    alpha: 1,
    worldAlpha: 1,
    mask: null,
    filters: null,
    renderable: true,
    worldVisible: true,
    getGlobalPosition: jest.fn(() => ({ x: 0, y: 0 })),
    getBounds: jest.fn(() => ({ x: 0, y: 0, width: 100, height: 100 })),
    getLocalBounds: jest.fn(() => ({ x: 0, y: 0, width: 100, height: 100 })),
    toGlobal: jest.fn((position) => position),
    toLocal: jest.fn((position) => position),
    setTransform: jest.fn(),
    updateTransform: jest.fn(),
    calculateBounds: jest.fn(),
    removeChildren: jest.fn(),
    sortChildren: jest.fn(),
    swapChildren: jest.fn(),
    getChildIndex: jest.fn(),
    setChildIndex: jest.fn(),
    getChildAt: jest.fn(),
    addChildAt: jest.fn(),
    removeChildAt: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    once: jest.fn(),
    emit: jest.fn(),
    eventNames: jest.fn(() => []),
    listeners: jest.fn(() => []),
    listenerCount: jest.fn(() => 0),
    removeAllListeners: jest.fn(),
  };

  const mockGraphics = {
    ...mockContainer,
    beginFill: jest.fn(function () {
      return this;
    }),
    endFill: jest.fn(function () {
      return this;
    }),
    drawRect: jest.fn(function () {
      return this;
    }),
    drawRoundedRect: jest.fn(function () {
      return this;
    }),
    drawCircle: jest.fn(function () {
      return this;
    }),
    drawEllipse: jest.fn(function () {
      return this;
    }),
    drawPolygon: jest.fn(function () {
      return this;
    }),
    lineStyle: jest.fn(function () {
      return this;
    }),
    moveTo: jest.fn(function () {
      return this;
    }),
    lineTo: jest.fn(function () {
      return this;
    }),
    bezierCurveTo: jest.fn(function () {
      return this;
    }),
    quadraticCurveTo: jest.fn(function () {
      return this;
    }),
    arc: jest.fn(function () {
      return this;
    }),
    arcTo: jest.fn(function () {
      return this;
    }),
    closePath: jest.fn(function () {
      return this;
    }),
    clear: jest.fn(function () {
      return this;
    }),
    isFastRect: jest.fn(() => false),
    containsPoint: jest.fn(() => false),
    tint: 0xffffff,
    blendMode: 0,
    shader: null,
    pluginName: "batch",
    currentPath: null,
    batches: [],
    batchTint: -1,
    batchDirty: -1,
    vertexData: null,
    geometry: null,
    _transformID: 0,
    _tintRGB: 16777215,
    state: {},
  };

  const createMockCanvas = () => {
    const canvas = {
      nodeName: "CANVAS",
      getContext: jest.fn(() => mockCanvasContext),
      toDataURL: jest.fn(() => "data:image/png;base64,"),
      width: 800,
      height: 600,
    };
    return canvas;
  };

  const mockApp = {
    stage: { ...mockContainer },
    renderer: {
      width: 800,
      height: 600,
      view: createMockCanvas(),
      backgroundColor: 0x000000,
      resolution: 1,
      transparent: false,
      antialias: false,
      forceFXAA: false,
      autoResize: false,
      preserveDrawingBuffer: false,
      clearBeforeRender: true,
      plugins: {},
      resize: jest.fn(),
      render: jest.fn(),
      destroy: jest.fn(),
      generateTexture: jest.fn(),
      reset: jest.fn(),
    },
    ticker: {
      add: jest.fn(),
      remove: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn(),
      speed: 1,
      started: false,
      FPS: 60,
      minFPS: 10,
      maxFPS: 60,
      deltaTime: 1,
      elapsedMS: 16.67,
      lastTime: 0,
      autoStart: true,
    },
    view: createMockCanvas(),
    screen: { x: 0, y: 0, width: 800, height: 600 },
    resizeTo: null,
    resize: jest.fn(),
    render: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    destroy: jest.fn(),
    loader: {
      add: jest.fn(function () {
        return this;
      }),
      load: jest.fn(function (callback) {
        if (callback) setTimeout(callback, 0);
        return this;
      }),
      resources: {},
      onProgress: { add: jest.fn() },
      onError: { add: jest.fn() },
      onLoad: { add: jest.fn() },
      onComplete: { add: jest.fn() },
      loading: false,
      progress: 100,
      reset: jest.fn(),
      destroy: jest.fn(),
    },
  };

  return {
    Application: jest.fn(() => mockApp),
    Container: jest.fn(() => ({ ...mockContainer })),
    Graphics: jest.fn(() => ({ ...mockGraphics })),
    Sprite: jest.fn(() => ({
      ...mockContainer,
      texture: null,
      anchor: { x: 0.5, y: 0.5 },
    })),
    Text: jest.fn(() => ({ ...mockContainer, text: "", style: {} })),
    Loader: jest.fn(() => mockApp.loader),
    Texture: {
      WHITE: { width: 1, height: 1, baseTexture: null },
      EMPTY: { width: 1, height: 1, baseTexture: null },
      from: jest.fn(() => ({ width: 1, height: 1, baseTexture: null })),
    },
    BaseTexture: {
      from: jest.fn(() => ({ width: 1, height: 1 })),
    },
    Rectangle: jest.fn((x, y, width, height) => ({ x, y, width, height })),
    Point: jest.fn((x, y) => ({ x, y })),
    autoDetectRenderer: jest.fn(() => mockApp.renderer),
    settings: {
      RESOLUTION: 1,
      RENDER_OPTIONS: {},
      PRECISION_FRAGMENT: "mediump",
      PRECISION_VERTEX: "highp",
      TARGET_FPMS: 0.06,
      MIPMAP_TEXTURES: 1,
      ANISOTROPIC_LEVEL: 0,
      FILTER_RESOLUTION: 1,
      FILTER_MULTISAMPLE: 1,
      SPRITE_MAX_TEXTURES: 32,
      SPRITE_BATCH_SIZE: 4096,
      UPLOADS_PER_FRAME: 4,
      CAN_UPLOAD_SAME_BUFFER: true,
      CREATE_IMAGE_BITMAP: false,
      ROUND_PIXELS: false,
      RETINA_PREFIX: /@(.+)x/,
      FAIL_IF_MAJOR_PERFORMANCE_CAVEAT: false,
      ADAPTER: null,
      GC_MODE: 0,
      GC_MAX_IDLE: 3600,
      GC_MAX_CHECK_COUNT: 600,
      WRAP_MODE: 33071,
      SCALE_MODE: 1,
      PRECISION: "highp",
      MESH_CANVAS_PADDING: 0,
      SORTABLE_CHILDREN: false,
    },
    utils: {
      hex2rgb: jest.fn((hex) => [
        ((hex >> 16) & 0xff) / 255,
        ((hex >> 8) & 0xff) / 255,
        (hex & 0xff) / 255,
      ]),
      hex2string: jest.fn((hex) => `#${hex.toString(16).padStart(6, "0")}`),
      rgb2hex: jest.fn(
        (rgb) => ((rgb[0] * 255) << 16) + ((rgb[1] * 255) << 8) + rgb[2] * 255
      ),
      string2hex: jest.fn((string) => parseInt(string.replace("#", ""), 16)),
      EventEmitter: class {
        constructor() {
          this.listeners = {};
        }
        on(event, fn) {
          if (!this.listeners[event]) this.listeners[event] = [];
          this.listeners[event].push(fn);
          return this;
        }
        off(event, fn) {
          if (!this.listeners[event]) return this;
          const index = this.listeners[event].indexOf(fn);
          if (index > -1) this.listeners[event].splice(index, 1);
          return this;
        }
        emit(event, ...args) {
          if (!this.listeners[event]) return false;
          this.listeners[event].forEach((fn) => fn(...args));
          return true;
        }
        once(event, fn) {
          const onceFn = (...args) => {
            this.off(event, onceFn);
            fn(...args);
          };
          return this.on(event, onceFn);
        }
        removeAllListeners(event) {
          if (event) {
            delete this.listeners[event];
          } else {
            this.listeners = {};
          }
          return this;
        }
        listenerCount(event) {
          return this.listeners[event] ? this.listeners[event].length : 0;
        }
        listeners(event) {
          return this.listeners[event] ? [...this.listeners[event]] : [];
        }
        eventNames() {
          return Object.keys(this.listeners);
        }
      },
    },
    BLEND_MODES: {
      NORMAL: 0,
      ADD: 1,
      MULTIPLY: 2,
      SCREEN: 3,
      OVERLAY: 4,
      DARKEN: 5,
      LIGHTEN: 6,
      COLOR_DODGE: 7,
      COLOR_BURN: 8,
      HARD_LIGHT: 9,
      SOFT_LIGHT: 10,
      DIFFERENCE: 11,
      EXCLUSION: 12,
      HUE: 13,
      SATURATION: 14,
      COLOR: 15,
      LUMINOSITY: 16,
      NORMAL_NPM: 17,
      ADD_NPM: 18,
      SCREEN_NPM: 19,
      NONE: 20,
      SRC_IN: 21,
      SRC_OUT: 22,
      SRC_ATOP: 23,
      DST_OVER: 24,
      DST_IN: 25,
      DST_OUT: 26,
      DST_ATOP: 27,
      SUBTRACT: 28,
      SRC_OVER: 0,
      XOR: 29,
    },
    SCALE_MODES: {
      NEAREST: 0,
      LINEAR: 1,
    },
    VERSION: "7.3.0",
  };
});

// Mock pixi-spine
jest.mock("pixi-spine", () => ({
  Spine: jest.fn(() => ({
    skeleton: {
      setToSetupPose: jest.fn(),
      updateWorldTransform: jest.fn(),
      data: {
        animations: [
          { name: "idle" },
          { name: "walk" },
          { name: "run" },
          { name: "jump" },
        ],
      },
    },
    state: {
      setAnimation: jest.fn(() => ({
        animation: { name: "idle" },
        loop: true,
        timeScale: 1,
      })),
      addAnimation: jest.fn(),
      setEmptyAnimation: jest.fn(),
      setEmptyAnimations: jest.fn(),
      clearTracks: jest.fn(),
      clearTrack: jest.fn(),
      data: {
        skeletonData: {
          animations: [
            { name: "idle" },
            { name: "walk" },
            { name: "run" },
            { name: "jump" },
          ],
        },
      },
      tracks: [],
      timeScale: 1,
    },
    spineData: {
      animations: [
        { name: "idle" },
        { name: "walk" },
        { name: "run" },
        { name: "jump" },
      ],
      skeletonData: {
        animations: [
          { name: "idle" },
          { name: "walk" },
          { name: "run" },
          { name: "jump" },
        ],
      },
    },
    autoUpdate: true,
    update: jest.fn(),
    destroy: jest.fn(),
    x: 0,
    y: 0,
    rotation: 0,
    scale: (() => {
      const scaleObj = { x: 1, y: 1 };
      scaleObj.set = jest.fn((value) => {
        scaleObj.x = value;
        scaleObj.y = value;
        return scaleObj;
      });
      return scaleObj;
    })(),
    addChild: jest.fn(),
    removeChild: jest.fn(),
    visible: true,
    interactive: false,
    buttonMode: false,
    hitArea: null,
    pivot: { x: 0, y: 0 },
    anchor: { x: 0.5, y: 0.5 },
    alpha: 1,
    worldAlpha: 1,
    mask: null,
    filters: null,
    renderable: true,
    worldVisible: true,
    width: 100,
    height: 100,
    children: [],
    parent: null,
    getBounds: jest.fn(() => ({ x: 0, y: 0, width: 100, height: 100 })),
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  })),
}));

// Mock performance.now
global.performance = {
  now: jest.fn(() => Date.now()),
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

// Mock window dimensions
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, "innerHeight", {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock devicePixelRatio
Object.defineProperty(window, "devicePixelRatio", {
  writable: true,
  configurable: true,
  value: 1,
});

// Mock resize event
window.addEventListener = jest.fn();
window.removeEventListener = jest.fn();
