import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let scene, camera, renderer, arToolkitSource, arToolkitContext, markerControls;

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize the Three.js scene components
    scene = new THREE.Scene();

    camera = new THREE.Camera();
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Add an event listener to handle window resizing
    window.addEventListener('resize', onResize);

    // Initialize the AR.js components (Toolkit source and context)

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam' // Access webcam feed for AR
    });

    arToolkitSource.init(() => onResize()); // Sync video feed to screen size

    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/three.js/data/camera_para.dat', // Calibration file for camera
        detectionMode: 'mono' // Detect simple image marker
    });

    // Initialize AR.js context and sync projection matrix
    arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    // NFT marker setup
    markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
        type: 'nft',
        descriptorsUrl: 'markers/Imagetarget', // Path to .iset, .fset, and .fset3 files
        changeMatrixMode: 'modelViewMatrix' // Sync model movement with marker
    });

    // Load a 3D model (GLTF format) and add to scene
    const loader = new GLTFLoader();

    loader.load('models/scene.gltf', (gltf) => {
        const model = gltf.scene;
        scene.add(model);
    });

    // Start the rendering loop
    requestAnimationFrame(render);

});

// Render loop function
function render() {
    // Update AR.js context
    if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
    }

    // Render the scene using the Three.js camera
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

// Handle resizing of window or screen
function onResize() {
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
}
