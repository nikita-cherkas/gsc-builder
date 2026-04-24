import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor(application) {
    this.application = application;
    this.sizes = application.sizes;
    this.scene = application.scene;
    this.canvas = application.canvas;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(45, this.sizes.aspect, 0.1, 40);
    this.instance.position.x = -12;
    this.instance.position.z = -10;
  }

  setOrbitControls() {
    const isMobile = window.innerWidth < 1024;

    this.controls = new OrbitControls(this.instance, this.canvas);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.04;

    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 1.2;
    this.controls.rotateSpeed = isMobile ? 1.2 : 0.8;

    this.controls.screenSpacePanning = false;
    this.controls.enabled = true;
    this.controls.enablePan = false;

    this.controls.minDistance = 7;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;

    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
  }

  resize() {
    this.instance.aspect = this.sizes.aspect;
    this.instance.updateProjectionMatrix();

    // if (window.innerWidth > 1920) {
    //   this.setCameraAndControlsPosition(1)
    // }
    // if (window.innerWidth <= 1920) {
    //   this.setCameraAndControlsPosition(1)
    // }
    // if (window.innerWidth <= 1440) {
    //   this.setCameraAndControlsPosition(1)
    // }
    // if (window.innerWidth <= 1024) {
    //   this.setCameraAndControlsPosition(1.3)
    // }
    // if (window.innerWidth <= 768) {
    //   this.setCameraAndControlsPosition(1.8)
    // }
    // if (window.innerWidth <= 425) {
    //   this.setCameraAndControlsPosition(2.5)
    // }
  }

  update() {
    if (this.controls && this.controls.update) this.controls.update();
  }
}
