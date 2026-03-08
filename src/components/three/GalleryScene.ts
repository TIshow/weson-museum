/**
 * WESON MUSEUM — 3D Gallery Scene
 *
 * 8枚の作品を円形カルーセルとして配置した Three.js ギャラリー。
 * - 自動回転（スロー）
 * - マウス / タッチドラッグで速度・方向操作
 * - ホバー時にアクセントカラーでフレームが光る
 */

import * as THREE from 'three';

// --- 定数 ---
const ARTWORK_COUNT = 8;
const RADIUS = 4.2;          // 円形配置の半径
const FRAME_W = 1.55;        // フレーム幅
const FRAME_H = 1.15;        // フレーム高さ
const BORDER = 0.07;         // フレームボーダー幅
const AUTO_SPEED = 0.0012;   // 自動回転速度（rad/frame）

// デザインシステムのカラーと一致させる
const C_BG      = 0x050b0a;
const C_FRAME   = 0x0c1a18;
const C_MAIN    = 0x34b2aa;
const C_ACCENT  = 0xfcfa0a;

export function initGallery(
  canvas: HTMLCanvasElement,
  basePath: string
): () => void {

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // --- Scene ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C_BG);
  scene.fog = new THREE.FogExp2(C_BG, 0.055);

  // --- Camera ---
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0.5, 6.5);
  camera.lookAt(0, 0, 0);

  // --- Lights ---
  // 全体に薄い環境光
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  // カメラ方向からのキーライト
  const keyLight = new THREE.DirectionalLight(0xdff0ee, 0.9);
  keyLight.position.set(0, 3, 6);
  scene.add(keyLight);

  // テール色のフィルライト（床下から）
  const fillLight = new THREE.PointLight(C_MAIN, 1.2, 25);
  fillLight.position.set(0, -3, 0);
  scene.add(fillLight);

  // 中央の微細なポイントライト
  const centerLight = new THREE.PointLight(C_MAIN, 0.4, 10);
  centerLight.position.set(0, 1, 0);
  scene.add(centerLight);

  // --- ギャラリーグループ（このグループごと回転させる） ---
  const gallery = new THREE.Group();
  scene.add(gallery);

  // --- ジオメトリ（共有） ---
  const imageGeo = new THREE.PlaneGeometry(FRAME_W, FRAME_H);
  const bgGeo    = new THREE.PlaneGeometry(FRAME_W + BORDER * 2, FRAME_H + BORDER * 2);

  // --- テクスチャローダー ---
  const loader = new THREE.TextureLoader();

  // ホバー検出用のメッシュ配列
  const hoverTargets: THREE.Mesh[] = [];

  for (let i = 0; i < ARTWORK_COUNT; i++) {
    const angle = (i / ARTWORK_COUNT) * Math.PI * 2;
    const x = Math.sin(angle) * RADIUS;
    const z = Math.cos(angle) * RADIUS;

    const frameGroup = new THREE.Group();
    frameGroup.position.set(x, 0, z);
    // フレームを円の外側に向かせる（カメラ方向に正面が来る）
    frameGroup.rotation.y = angle;
    gallery.add(frameGroup);

    // --- フレームボーダー（テール発光） ---
    const bgMat = new THREE.MeshStandardMaterial({
      color: C_FRAME,
      emissive: new THREE.Color(C_MAIN),
      emissiveIntensity: 0.18,
      roughness: 0.9,
      metalness: 0.1,
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.z = -0.005;
    frameGroup.add(bgMesh);

    // --- 作品画像プレーン ---
    // ロード前はプレースホルダーとして暗いマテリアル
    const imgMat = new THREE.MeshBasicMaterial({ color: 0x0a1512 });
    const imgMesh = new THREE.Mesh(imageGeo, imgMat);
    frameGroup.add(imgMesh);
    hoverTargets.push(imgMesh);

    // ホバー用にメタデータを保存
    imgMesh.userData = { frameGroup, bgMesh, bgMat };

    // テクスチャ読み込み
    const url = `${basePath}images/artworks/artwork${i + 1}.jpg`;
    loader.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      (imgMesh.material as THREE.MeshBasicMaterial).dispose();
      imgMesh.material = new THREE.MeshBasicMaterial({ map: texture });
    });
  }

  // --- サイズ同期 ---
  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.parentElement!);

  // --- マウス / ドラッグ ---
  let isDragging = false;
  let prevX = 0;
  let dragVelocity = 0;
  let rotationSpeed = AUTO_SPEED;

  const onMouseDown = (e: MouseEvent) => {
    isDragging = true;
    prevX = e.clientX;
    canvas.style.cursor = 'grabbing';
  };
  const onMouseUp = () => {
    isDragging = false;
    rotationSpeed = dragVelocity;
    canvas.style.cursor = 'grab';
  };
  const onMouseDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - prevX;
    dragVelocity = delta * 0.002;
    gallery.rotation.y += dragVelocity;
    prevX = e.clientX;
  };

  // --- タッチ対応 ---
  const onTouchStart = (e: TouchEvent) => {
    isDragging = true;
    prevX = e.touches[0].clientX;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - prevX;
    dragVelocity = delta * 0.003;
    gallery.rotation.y += dragVelocity;
    prevX = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    isDragging = false;
    rotationSpeed = dragVelocity;
  };

  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mousemove', onMouseDrag);
  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchmove', onTouchMove, { passive: true });
  canvas.addEventListener('touchend', onTouchEnd);
  canvas.style.cursor = 'grab';

  // --- ホバー検出（Raycaster） ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  let hoveredMesh: THREE.Mesh | null = null;

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
  };
  canvas.addEventListener('mousemove', onMouseMove);

  const setHover = (mesh: THREE.Mesh | null) => {
    if (mesh === hoveredMesh) return;

    // 前のホバーを解除
    if (hoveredMesh) {
      const { bgMat, frameGroup } = hoveredMesh.userData as {
        bgMat: THREE.MeshStandardMaterial;
        frameGroup: THREE.Group;
      };
      bgMat.emissive.setHex(C_MAIN);
      bgMat.emissiveIntensity = 0.18;
      frameGroup.scale.setScalar(1);
    }

    hoveredMesh = mesh;

    // 新しいホバーを適用
    if (mesh) {
      const { bgMat, frameGroup } = mesh.userData as {
        bgMat: THREE.MeshStandardMaterial;
        frameGroup: THREE.Group;
      };
      bgMat.emissive.setHex(C_ACCENT);
      bgMat.emissiveIntensity = 0.6;
      frameGroup.scale.setScalar(1.045);
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
    }
  };

  // --- アニメーションループ ---
  let animId: number;

  const animate = () => {
    animId = requestAnimationFrame(animate);

    // 自動回転（ドラッグ後は慣性で戻る）
    if (!isDragging) {
      rotationSpeed += (AUTO_SPEED - rotationSpeed) * 0.025;
      dragVelocity *= 0.95;
    }
    gallery.rotation.y += rotationSpeed;

    // ホバー検出
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(hoverTargets);
    setHover(hits.length > 0 ? (hits[0].object as THREE.Mesh) : null);

    renderer.render(scene, camera);
  };

  animate();

  // --- クリーンアップ ---
  return () => {
    cancelAnimationFrame(animId);
    resizeObserver.disconnect();
    canvas.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('mousemove', onMouseDrag);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchmove', onTouchMove);
    canvas.removeEventListener('touchend', onTouchEnd);
    renderer.dispose();
    imageGeo.dispose();
    bgGeo.dispose();
  };
}
