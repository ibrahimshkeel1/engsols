import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  InstancedMesh,
  MathUtils,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PMREMGenerator,
  PointLight,
  Raycaster,
  Scene,
  ShaderChunk,
  SphereGeometry,
  SRGBColorSpace,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type SizeInfo = {
  width: number;
  height: number;
  wWidth: number;
  wHeight: number;
  ratio: number;
  pixelRatio: number;
};

type RenderClock = {
  elapsed: number;
  delta: number;
};

type ThreeEngineOptions = {
  canvas?: HTMLCanvasElement;
  id?: string;
  size?: "parent" | { width: number; height: number };
  rendererOptions?: ConstructorParameters<typeof WebGLRenderer>[0];
};

type PostComposer = {
  render: () => void;
  setSize: (w: number, h: number) => void;
  dispose: () => void;
};

class ThreeEngine {
  #options: ThreeEngineOptions;
  canvas!: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov!: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene!: Scene;
  renderer!: WebGLRenderer;
  #composer?: PostComposer;
  size: SizeInfo = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.#renderFrame;
  onBeforeRender: (clock: RenderClock) => void = () => {};
  onAfterRender: (clock: RenderClock) => void = () => {};
  onAfterResize: (size: SizeInfo) => void = () => {};
  #isVisible = false;
  #isAnimating = false;
  isDisposed = false;
  #resizeTimer?: ReturnType<typeof setTimeout>;
  #resizeObserver?: ResizeObserver;
  #intersectionObserver?: IntersectionObserver;
  #timer = new Timer();
  #clock: RenderClock = { elapsed: 0, delta: 0 };
  #animationFrame?: number;

  constructor(options: ThreeEngineOptions) {
    this.#options = { ...options };
    this.#initCamera();
    this.#initScene();
    this.#initRenderer();
    this.resize();
    this.#bindLifecycle();
  }

  #initCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  #initScene() {
    this.scene = new Scene();
  }

  #initRenderer() {
    if (this.#options.canvas) {
      this.canvas = this.#options.canvas;
    } else if (this.#options.id) {
      const el = document.getElementById(this.#options.id);
      if (!(el instanceof HTMLCanvasElement)) {
        throw new Error("Three: Missing canvas or id parameter");
      }
      this.canvas = el;
    } else {
      throw new Error("Three: Missing canvas or id parameter");
    }

    this.canvas.style.display = "block";
    try {
      this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        ...(this.#options.rendererOptions ?? {}),
      });
    } catch (error) {
      throw new Error("Ballpit: WebGL is not available", { cause: error });
    }

    const gl = this.renderer.getContext();
    if (!gl || gl.isContextLost()) {
      throw new Error("Ballpit: WebGL context could not be created");
    }

    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  #bindLifecycle() {
    if (!(this.#options.size instanceof Object)) {
      window.addEventListener("resize", this.#scheduleResize);
      if (this.#options.size === "parent" && this.canvas.parentNode instanceof HTMLElement) {
        this.#resizeObserver = new ResizeObserver(this.#scheduleResize);
        this.#resizeObserver.observe(this.canvas.parentNode);
      }
    }

    this.#intersectionObserver = new IntersectionObserver(this.#onIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.#onVisibilityChange);
  }

  #unbindLifecycle() {
    window.removeEventListener("resize", this.#scheduleResize);
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.#onVisibilityChange);
  }

  #onIntersect = (entries: IntersectionObserverEntry[]) => {
    this.#isVisible = entries[0]?.isIntersecting ?? false;
    if (this.#isVisible) this.#startAnimation();
    else this.#stopAnimation();
  };

  #onVisibilityChange = () => {
    if (!this.#isVisible) return;
    if (document.hidden) this.#stopAnimation();
    else this.#startAnimation();
  };

  #scheduleResize = () => {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = setTimeout(() => this.resize(), 100);
  };

  resize() {
    let width: number;
    let height: number;

    if (this.#options.size instanceof Object) {
      width = this.#options.size.width;
      height = this.#options.size.height;
    } else if (this.#options.size === "parent" && this.canvas.parentNode) {
      const parent = this.canvas.parentNode as HTMLElement;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;
    this.#updateCameraAspect();
    this.#updateRendererSize();
    this.onAfterResize(this.size);
  }

  #updateCameraAspect() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#setFovForAspect(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#setFovForAspect(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  #setFovForAspect(targetAspect: number) {
    const halfFov = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / targetAspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(halfFov));
  }

  updateWorldSize() {
    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.length();
    this.size.wWidth = this.size.wHeight * this.camera.aspect;
  }

  #updateRendererSize() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#composer?.setSize(this.size.width, this.size.height);

    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  get postprocessing(): PostComposer | undefined {
    return this.#composer;
  }

  set postprocessing(composer: PostComposer | undefined) {
    this.#composer = composer;
    if (composer) this.render = composer.render.bind(composer);
  }

  #startAnimation() {
    if (this.#isAnimating) return;
    const tick = () => {
      this.#animationFrame = requestAnimationFrame(tick);
      this.#timer.update();
      this.#clock.delta = this.#timer.getDelta();
      this.#clock.elapsed += this.#clock.delta;
      this.onBeforeRender(this.#clock);
      this.render();
      this.onAfterRender(this.#clock);
    };
    this.#isAnimating = true;
    this.#timer.reset();
    tick();
  }

  #stopAnimation() {
    if (!this.#isAnimating) return;
    if (this.#animationFrame) cancelAnimationFrame(this.#animationFrame);
    this.#isAnimating = false;
  }

  #renderFrame() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse((object) => {
      if (!("isMesh" in object) || !object.isMesh) return;
      const mesh = object as InstancedMesh;
      const material = mesh.material;
      if (Array.isArray(material)) {
        material.forEach((entry) => entry.dispose());
      } else if (material) {
        material.dispose();
      }
      mesh.geometry?.dispose();
    });
    this.scene.clear();
  }

  dispose() {
    this.#unbindLifecycle();
    this.#stopAnimation();
    this.#timer.dispose();
    this.clear();
    this.#composer?.dispose();
    this.renderer.dispose();
    this.isDisposed = true;
  }
}

type PointerTracker = {
  position: Vector2;
  nPosition: Vector2;
  hover: boolean;
  touching: boolean;
  onEnter: (tracker: PointerTracker) => void;
  onMove: (tracker: PointerTracker) => void;
  onClick: (tracker: PointerTracker) => void;
  onLeave: (tracker: PointerTracker) => void;
  dispose: () => void;
};

const pointerTrackers = new Map<HTMLElement, PointerTracker>();
const globalPointer = new Vector2();
let pointerListenersBound = false;

function bindPointerListeners() {
  if (pointerListenersBound) return;
  document.body.addEventListener("pointermove", onPointerMove);
  document.body.addEventListener("pointerleave", onPointerLeave);
  document.body.addEventListener("click", onPointerClick);
  document.body.addEventListener("touchstart", onTouchStart, { passive: false });
  document.body.addEventListener("touchmove", onTouchMove, { passive: false });
  document.body.addEventListener("touchend", onTouchEnd, { passive: false });
  document.body.addEventListener("touchcancel", onTouchEnd, { passive: false });
  pointerListenersBound = true;
}

function unbindPointerListeners() {
  if (!pointerListenersBound) return;
  document.body.removeEventListener("pointermove", onPointerMove);
  document.body.removeEventListener("pointerleave", onPointerLeave);
  document.body.removeEventListener("click", onPointerClick);
  document.body.removeEventListener("touchstart", onTouchStart);
  document.body.removeEventListener("touchmove", onTouchMove);
  document.body.removeEventListener("touchend", onTouchEnd);
  document.body.removeEventListener("touchcancel", onTouchEnd);
  pointerListenersBound = false;
}

function createPointerTracker(options: {
  domElement: HTMLElement;
  onEnter?: (tracker: PointerTracker) => void;
  onMove?: (tracker: PointerTracker) => void;
  onClick?: (tracker: PointerTracker) => void;
  onLeave?: (tracker: PointerTracker) => void;
}): PointerTracker {
  const tracker: PointerTracker = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter: options.onEnter ?? (() => {}),
    onMove: options.onMove ?? (() => {}),
    onClick: options.onClick ?? (() => {}),
    onLeave: options.onLeave ?? (() => {}),
    dispose: () => {
      pointerTrackers.delete(options.domElement);
      if (pointerTrackers.size === 0) unbindPointerListeners();
    },
  };

  if (!pointerTrackers.has(options.domElement)) {
    pointerTrackers.set(options.domElement, tracker);
    bindPointerListeners();
  }

  return tracker;
}

function updateTrackerPosition(tracker: PointerTracker, rect: DOMRect) {
  tracker.position.x = globalPointer.x - rect.left;
  tracker.position.y = globalPointer.y - rect.top;
  tracker.nPosition.x = (tracker.position.x / rect.width) * 2 - 1;
  tracker.nPosition.y = (-tracker.position.y / rect.height) * 2 + 1;
}

function isInsideRect(rect: DOMRect) {
  return (
    globalPointer.x >= rect.left &&
    globalPointer.x <= rect.left + rect.width &&
    globalPointer.y >= rect.top &&
    globalPointer.y <= rect.top + rect.height
  );
}

function processPointerInteraction() {
  for (const [element, tracker] of pointerTrackers) {
    const rect = element.getBoundingClientRect();
    if (isInsideRect(rect)) {
      updateTrackerPosition(tracker, rect);
      if (!tracker.hover) {
        tracker.hover = true;
        tracker.onEnter(tracker);
      }
      tracker.onMove(tracker);
    } else if (tracker.hover && !tracker.touching) {
      tracker.hover = false;
      tracker.onLeave(tracker);
    }
  }
}

function onPointerMove(event: PointerEvent) {
  globalPointer.x = event.clientX;
  globalPointer.y = event.clientY;
  processPointerInteraction();
}

function onPointerClick(event: MouseEvent) {
  globalPointer.x = event.clientX;
  globalPointer.y = event.clientY;
  for (const [element, tracker] of pointerTrackers) {
    const rect = element.getBoundingClientRect();
    updateTrackerPosition(tracker, rect);
    if (isInsideRect(rect)) tracker.onClick(tracker);
  }
}

function onPointerLeave() {
  for (const tracker of pointerTrackers.values()) {
    if (tracker.hover) {
      tracker.hover = false;
      tracker.onLeave(tracker);
    }
  }
}

function onTouchStart(event: TouchEvent) {
  if (event.touches.length === 0) return;
  event.preventDefault();
  globalPointer.x = event.touches[0].clientX;
  globalPointer.y = event.touches[0].clientY;

  for (const [element, tracker] of pointerTrackers) {
    const rect = element.getBoundingClientRect();
    if (isInsideRect(rect)) {
      tracker.touching = true;
      updateTrackerPosition(tracker, rect);
      if (!tracker.hover) {
        tracker.hover = true;
        tracker.onEnter(tracker);
      }
      tracker.onMove(tracker);
    }
  }
}

function onTouchMove(event: TouchEvent) {
  if (event.touches.length === 0) return;
  event.preventDefault();
  globalPointer.x = event.touches[0].clientX;
  globalPointer.y = event.touches[0].clientY;

  for (const [element, tracker] of pointerTrackers) {
    const rect = element.getBoundingClientRect();
    updateTrackerPosition(tracker, rect);
    if (isInsideRect(rect)) {
      if (!tracker.hover) {
        tracker.hover = true;
        tracker.touching = true;
        tracker.onEnter(tracker);
      }
      tracker.onMove(tracker);
    } else if (tracker.hover && tracker.touching) {
      tracker.onMove(tracker);
    }
  }
}

function onTouchEnd() {
  for (const tracker of pointerTrackers.values()) {
    if (tracker.touching) {
      tracker.touching = false;
      if (tracker.hover) {
        tracker.hover = false;
        tracker.onLeave(tracker);
      }
    }
  }
}

const { randFloat, randFloatSpread } = MathUtils;
const tempVecA = new Vector3();
const tempVecB = new Vector3();
const tempVecC = new Vector3();
const tempVecD = new Vector3();
const tempVecE = new Vector3();
const tempVecF = new Vector3();
const tempVecG = new Vector3();
const tempVecH = new Vector3();
const tempVecI = new Vector3();
const tempVecJ = new Vector3();

export type BallpitConfig = {
  count: number;
  colors: number[];
  ambientColor: number;
  ambientIntensity: number;
  lightIntensity: number;
  materialParams: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    clearcoatRoughness: number;
  };
  minSize: number;
  maxSize: number;
  size0: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  controlSphere0: boolean;
  followCursor: boolean;
};

class BallPhysics {
  config: BallpitConfig;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center: Vector3;

  constructor(config: BallpitConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new Vector3();
    this.#initPositions();
    this.setSizes();
  }

  #initPositions() {
    this.center.toArray(this.positionData, 0);
    for (let i = 1; i < this.config.count; i++) {
      const base = 3 * i;
      this.positionData[base] = randFloatSpread(2 * this.config.maxX);
      this.positionData[base + 1] = randFloatSpread(2 * this.config.maxY);
      this.positionData[base + 2] = randFloatSpread(2 * this.config.maxZ);
    }
  }

  setSizes() {
    this.sizeData[0] = this.config.size0;
    for (let i = 1; i < this.config.count; i++) {
      this.sizeData[i] = randFloat(this.config.minSize, this.config.maxSize);
    }
  }

  update(clock: RenderClock) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIndex = 0;

    if (config.controlSphere0) {
      startIndex = 1;
      tempVecA.fromArray(positionData, 0);
      tempVecA.lerp(center, 0.1).toArray(positionData, 0);
      tempVecE.set(0, 0, 0).toArray(velocityData, 0);
    }

    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      tempVecB.fromArray(positionData, base);
      tempVecE.fromArray(velocityData, base);
      tempVecE.y -= clock.delta * config.gravity * sizeData[idx];
      tempVecE.multiplyScalar(config.friction);
      tempVecE.clampLength(0, config.maxVelocity);
      tempVecB.add(tempVecE);
      tempVecB.toArray(positionData, base);
      tempVecE.toArray(velocityData, base);
    }

    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      tempVecB.fromArray(positionData, base);
      tempVecE.fromArray(velocityData, base);
      const radius = sizeData[idx];

      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        tempVecC.fromArray(positionData, otherBase);
        tempVecF.fromArray(velocityData, otherBase);
        const otherRadius = sizeData[jdx];
        tempVecG.copy(tempVecC).sub(tempVecB);
        const distance = tempVecG.length();
        const sumRadius = radius + otherRadius;

        if (distance < sumRadius) {
          const overlap = sumRadius - distance;
          tempVecJ.copy(tempVecG).normalize().multiplyScalar(0.5 * overlap);
          tempVecH.copy(tempVecJ).multiplyScalar(Math.max(tempVecE.length(), 1));
          tempVecI.copy(tempVecJ).multiplyScalar(Math.max(tempVecF.length(), 1));
          tempVecB.sub(tempVecJ);
          tempVecE.sub(tempVecH);
          tempVecB.toArray(positionData, base);
          tempVecE.toArray(velocityData, base);
          tempVecC.add(tempVecJ);
          tempVecF.add(tempVecI);
          tempVecC.toArray(positionData, otherBase);
          tempVecF.toArray(velocityData, otherBase);
        }
      }

      if (config.controlSphere0) {
        tempVecG.copy(tempVecA).sub(tempVecB);
        const distance = tempVecG.length();
        const sumRadius0 = radius + sizeData[0];
        if (distance < sumRadius0) {
          const diff = sumRadius0 - distance;
          tempVecJ.copy(tempVecG.normalize()).multiplyScalar(diff);
          tempVecH.copy(tempVecJ).multiplyScalar(Math.max(tempVecE.length(), 2));
          tempVecB.sub(tempVecJ);
          tempVecE.sub(tempVecH);
        }
      }

      if (Math.abs(tempVecB.x) + radius > config.maxX) {
        tempVecB.x = Math.sign(tempVecB.x) * (config.maxX - radius);
        tempVecE.x = -tempVecE.x * config.wallBounce;
      }

      if (config.gravity === 0) {
        if (Math.abs(tempVecB.y) + radius > config.maxY) {
          tempVecB.y = Math.sign(tempVecB.y) * (config.maxY - radius);
          tempVecE.y = -tempVecE.y * config.wallBounce;
        }
      } else if (tempVecB.y - radius < -config.maxY) {
        tempVecB.y = -config.maxY + radius;
        tempVecE.y = -tempVecE.y * config.wallBounce;
      }

      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(tempVecB.z) + radius > maxBoundary) {
        tempVecB.z = Math.sign(tempVecB.z) * (config.maxZ - radius);
        tempVecE.z = -tempVecE.z * config.wallBounce;
      }

      tempVecB.toArray(positionData, base);
      tempVecE.toArray(velocityData, base);
    }
  }
}

class BallMaterial extends MeshPhysicalMaterial {
  constructor(params: ConstructorParameters<typeof MeshPhysicalMaterial>[0]) {
    super(params);
    this.defines = { ...this.defines, USE_UV: "" };
    const uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };

    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.fragmentShader =
        `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #ifdef USE_COLOR
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor.rgb;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {
      `,
      );

      const lightsFragment = ShaderChunk.lights_fragment_begin.replaceAll(
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",
        `
          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
        `,
      );
      shader.fragmentShader = shader.fragmentShader.replace("#include <lights_fragment_begin>", lightsFragment);
    };
  }
}

const DEFAULT_CONFIG: BallpitConfig = {
  count: 200,
  colors: [0, 0, 0],
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
};

const instanceMatrixHelper = new Object3D();

function createColorGradient(colors: number[]) {
  const palette: Color[] = colors.map((color) => new Color(color));
  return {
    getColorAt(ratio: number, out = new Color()) {
      const scaled = Math.max(0, Math.min(1, ratio)) * (colors.length - 1);
      const index = Math.floor(scaled);
      const start = palette[index];
      if (index >= colors.length - 1) return start.clone();
      const alpha = scaled - index;
      const end = palette[index + 1];
      out.r = start.r + alpha * (end.r - start.r);
      out.g = start.g + alpha * (end.g - start.g);
      out.b = start.b + alpha * (end.b - start.b);
      return out;
    },
  };
}

class BallpitMesh extends InstancedMesh {
  config: BallpitConfig;
  physics: BallPhysics;
  ambientLight!: AmbientLight;
  light!: PointLight;

  constructor(renderer: WebGLRenderer, options: Partial<BallpitConfig> = {}) {
    const config = { ...DEFAULT_CONFIG, ...options };
    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(room).texture;
    pmrem.dispose();
    const geometry = new SphereGeometry();
    let material: BallMaterial | MeshPhysicalMaterial;
    try {
      material = new BallMaterial({ envMap, ...config.materialParams });
      if (material.envMapRotation) {
        material.envMapRotation.x = -Math.PI / 2;
      }
    } catch {
      material = new MeshPhysicalMaterial({ envMap, ...config.materialParams });
    }
    super(geometry, material, config.count);

    this.config = config;
    this.physics = new BallPhysics(config);
    this.ambientLight = new AmbientLight(config.ambientColor, config.ambientIntensity);
    this.light = new PointLight(config.colors[0] ?? 0xffffff, config.lightIntensity);
    this.add(this.ambientLight);
    this.add(this.light);
    this.setColors(config.colors);
  }

  setColors(colors: number[]) {
    if (!Array.isArray(colors) || colors.length < 2) return;
    const gradient = createColorGradient(colors);
    for (let idx = 0; idx < this.count; idx++) {
      this.setColorAt(idx, gradient.getColorAt(idx / this.count));
      if (idx === 0) this.light.color.copy(gradient.getColorAt(idx / this.count));
    }
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  }

  update(clock: RenderClock) {
    this.physics.update(clock);
    for (let idx = 0; idx < this.count; idx++) {
      instanceMatrixHelper.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        instanceMatrixHelper.scale.setScalar(0);
      } else {
        instanceMatrixHelper.scale.setScalar(this.physics.sizeData[idx]);
      }
      instanceMatrixHelper.updateMatrix();
      this.setMatrixAt(idx, instanceMatrixHelper.matrix);
      if (idx === 0) this.light.position.copy(instanceMatrixHelper.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

export type BallpitInstance = {
  three: ThreeEngine;
  spheres: BallpitMesh | null;
  setCount: (count: number) => void;
  togglePause: () => void;
  dispose: () => void;
};

function canInitializeRenderer(renderer: WebGLRenderer, width: number, height: number) {
  if (width < 2 || height < 2) return false;
  const gl = renderer.getContext();
  return gl != null && !gl.isContextLost();
}

export function createBallpit(
  canvas: HTMLCanvasElement,
  options: Partial<BallpitConfig> = {},
): BallpitInstance {
  const engine = new ThreeEngine({
    canvas,
    size: "parent",
    rendererOptions: { antialias: true, alpha: true },
  });

  let spheres: BallpitMesh | null = null;
  let paused = false;
  let pendingConfig: Partial<BallpitConfig> = options;

  engine.renderer.toneMapping = ACESFilmicToneMapping;
  engine.renderer.setClearColor(0x000000, 0);
  engine.camera.position.set(0, 0, 20);
  engine.camera.lookAt(0, 0, 0);
  engine.cameraMaxAspect = 1.5;
  engine.resize();

  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersection = new Vector3();

  canvas.style.touchAction = "none";
  canvas.style.userSelect = "none";

  const initialize = (config: Partial<BallpitConfig>) => {
    if (!canInitializeRenderer(engine.renderer, engine.size.width, engine.size.height)) {
      pendingConfig = config;
      return false;
    }

    if (spheres) {
      engine.clear();
      engine.scene.remove(spheres);
    }

    spheres = new BallpitMesh(engine.renderer, config);
    engine.scene.add(spheres);
    pendingConfig = config;
    return true;
  };

  if (!initialize(options)) {
    pendingConfig = options;
  }

  const tracker = createPointerTracker({
    domElement: canvas,
    onMove() {
      if (!spheres) return;
      raycaster.setFromCamera(tracker.nPosition, engine.camera);
      engine.camera.getWorldDirection(plane.normal);
      const hit = raycaster.ray.intersectPlane(plane, intersection);
      if (hit) {
        spheres.physics.center.copy(intersection);
        spheres.config.controlSphere0 = true;
      }
    },
    onLeave() {
      if (spheres) spheres.config.controlSphere0 = false;
    },
  });

  engine.onBeforeRender = (clock) => {
    if (!paused && spheres) spheres.update(clock);
  };

  const previousOnAfterResize = engine.onAfterResize;
  engine.onAfterResize = (size) => {
    previousOnAfterResize(size);
    if (!spheres) {
      initialize(pendingConfig);
    }
    if (spheres) {
      spheres.config.maxX = size.wWidth / 2;
      spheres.config.maxY = size.wHeight / 2;
    }
  };

  const boot = () => {
    engine.resize();
    if (!spheres) initialize(pendingConfig);
  };

  boot();
  requestAnimationFrame(boot);

  return {
    three: engine,
    get spheres() {
      return spheres;
    },
    setCount(count: number) {
      if (spheres) {
        initialize({ ...spheres.config, count });
      } else {
        pendingConfig = { ...pendingConfig, count };
      }
    },
    togglePause() {
      paused = !paused;
    },
    dispose() {
      tracker.dispose();
      engine.dispose();
    },
  };
}

export type { BallpitConfig as BallpitOptions };

export function isWebGLSupported() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    return gl != null;
  } catch {
    return false;
  }
}
