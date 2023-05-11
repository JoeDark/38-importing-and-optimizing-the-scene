import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

/**
 * spector
 */
import * as SPECTOR from 'spectorjs'
const spector = new SPECTOR.Spector();
//spector.displayUI(); //dispaly spector ui

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false // SOMETIMES NEED TO FLIP OR ALL MATS ARE JUST UNWRAP MAP
bakedTexture.encoding = THREE.sRGBEncoding ////Color correction

/**
 * model
 */
//baked material
const bakedMaterial = new THREE.MeshBasicMaterial({map: bakedTexture})

//portal light material
const portalLightMaterial = new THREE.MeshBasicMaterial({color: 0XFFD96E})
//portal material
const portalMaterial = new THREE.MeshBasicMaterial({color: 0X3150FD,side: THREE.DoubleSide})
//gem material
const gemMaterial = new THREE.MeshBasicMaterial({color: 0X9621FF})

gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        //console.log(gltf.scene)
        // gltf.scene.traverse((child) =>
        // {
        //     child.material = bakedMaterial
        // })
        const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
        bakedMesh.material = bakedMaterial
            //Ctrl + j in blender to merge items into one
       const portalLightAMesh =  gltf.scene.children.find((child) => child.name === 'portalLightA')
       portalLightAMesh.material = portalLightMaterial
       const portalLightBMesh =  gltf.scene.children.find((child) => child.name === 'portalLightB')
       portalLightBMesh.material = portalLightMaterial
       const portalMesh =  gltf.scene.children.find((child) => child.name === 'portal')
       portalMesh.material = portalMaterial
       const gemAMesh =  gltf.scene.children.find((child) => child.name === 'gemA')
       gemAMesh.material = gemMaterial
       const gemBMesh =  gltf.scene.children.find((child) => child.name === 'gemB')
       gemBMesh.material = gemMaterial




        scene.add(gltf.scene)
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.outputEncoding = THREE.sRGBEncoding //Color correction
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()