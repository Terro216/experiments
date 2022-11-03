import * as THREE from 'three'
import * as front from './files/front.png'
import * as back from './files/back.png'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'

// revolutions per second
let angularSpeed = 0.2
let lastTime = 0
let g = 9.8

let V0 = 10
let t = 0

// this function is executed on each animation frame

function reset() {
	coin.position.y = 0
	camera.position.x = 0
	camera.position.y = 0
	camera.position.z = 35
	camera.lookAt(coin.position)
	t = 0
}

function animate() {
	// update
	let time = new Date().getTime()
	let timeDiff = time - lastTime
	let angleChange = (angularSpeed * timeDiff * Math.PI) / 100

	lastTime = time

	if (coin.position.y >= 0) {
		coin.rotation.x += angleChange
		coin.position.y = V0 * t - (g * t * t) / 2
		t += 0.02
	}

	// render
	controls.update(0.01)
	renderer.render(scene, camera)
	// request new frame
	requestAnimationFrame(animate)
}

// renderer
let renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// scene
let scene = new THREE.Scene()
scene.background = new THREE.Color(0xffeedc)

// camera
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000)
camera.position.z = 35

//lights
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5, -28, 5)
const pointLight2 = new THREE.PointLight(0x00ffff)
pointLight2.position.set(5, 5, 5)
const ambientLight = new THREE.AmbientLight(0x404040)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(pointLight, pointLight2, ambientLight, directionalLight)

// coin
const textureLoader = new THREE.TextureLoader()
const face1Material = new THREE.MeshLambertMaterial({ map: textureLoader.load(front) })
const face2Material = new THREE.MeshLambertMaterial({ map: textureLoader.load(back) })

let coin = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.5, 80, 80, false), [
	new THREE.MeshStandardMaterial({ color: '0xffffff' }),
	face1Material,
	face2Material,
])
scene.add(coin)

//controls
let controls = new FlyControls(camera, renderer.domElement)
controls.movementSpeed = 100
controls.rollSpeed = Math.PI / 2
controls.autoForward = false
controls.dragToLook = true

// start animation
animate()

document.querySelector('.reset').addEventListener('click', reset)
