import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth-1, window.innerHeight-1);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

var helicop = null;
loader.load( 'Model/scene_helicopter.glb', function ( gltf ) {
    helicop = gltf.scene;
    helicop.scale.set(0.3, 0.3, 0.3);
	helicop.translateY(1);	
	helicop.rotation.y = -1;
	scene.add( helicop );
}, undefined, function ( error ) {
	console.error( error );
} );

var wings = null;
var wings_position = 2.2;
loader.load( 'Model/scene_wings.glb', function ( gltf ) {
    wings = gltf.scene;
    wings.scale.set(0.4, 0.4, 0.4);
	wings.position.set(0, wings_position, 0);	
	scene.add(wings);
}, undefined, function ( error ) {
	console.error( error );
} );

var floor = null;
loader.load( 'Model/scene_floor.glb', function ( gltf ) {
    floor = gltf.scene;
    floor.scale.set(0.5, 0.2, 0.3);
	floor.position.set(0, -0.1, 0);	
	scene.add(floor);
}, undefined, function ( error ) {
	console.error( error );
} );

const light1 = new THREE.PointLight(0xffffff, 60, 40);
light1.position.set(1, 3, 5);
scene.add(light1);

const keyboardState = {};
document.addEventListener('keydown', (event) => {
    keyboardState[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keyboardState[event.code] = false;
});

const listener = new THREE.AudioListener();
scene.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'Audio/inside-of-a-helicopter-54404.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume(1.0);	
    sound.play(); 
});

const sound1 = new THREE.Audio( listener );
const audioLoader1 = new THREE.AudioLoader();
audioLoader1.load( 'Audio/helicopter-beat-47617.mp3', function( buffer ) {
	sound1.setBuffer( buffer );
	sound1.setLoop( true );
	sound1.setVolume(1.0);	
    //sound1.play();
});

var angle = 0;
document.addEventListener('click', () => {	
    const radius = 5;    
    angle += 45;    
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    light1.position.x = x;
    light1.position.z = z;
    
});

function animate() {
    requestAnimationFrame(animate);        
	if (wings.position.y <= wings_position) {
        wings.rotation.y += 0.1;          
        sound.play();  
        sound1.stop();    	
    }
    if (wings.position.y > wings_position) {
        wings.rotation.y += 1; 
        sound1.play();
        sound.stop();
    }
	if (keyboardState['ArrowLeft']) {
        scene.rotation.y += 0.01; 
    }
    if (keyboardState['ArrowRight']) {
        scene.rotation.y -= 0.01; 
    }
    if (keyboardState['ArrowUp'] && (helicop.position.y <= 5)) {
        helicop.position.y += 0.1;
        wings.position.y += 0.1;
        wings.rotation.y += 1;
    }
    if (keyboardState['ArrowDown'] && (helicop.position.y >= 1.1)) {
        helicop.position.y -= 0.1;
        wings.position.y -= 0.1;
        wings.rotation.y += 1;
    }
    renderer.render(scene, camera);
}
animate();
