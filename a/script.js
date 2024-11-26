import * as THREE from 'three';
import * as THREE from 'three';

// 3D model setup using Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#clothing-model') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Add a simple 3D object (like a box representing a clothing item)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

// Add this new function for the wave banner
function createWaveBanner() {
    const waveScene = new THREE.Scene();
    const waveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / 200, 0.1, 1000);
    const waveRenderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#wave-canvas'), alpha: true });
    waveRenderer.setSize(window.innerWidth, 200);

    const waveGeometry = new THREE.PlaneGeometry(window.innerWidth, 200, 50, 50);
    const waveMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            colorA: { value: new THREE.Color(0xff0000) },
            colorB: { value: new THREE.Color(0x0000ff) }
        },
        vertexShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
                vUv = uv;
                vec3 pos = position;
                pos.z = sin(pos.x * 0.05 + time) * 10.0;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 colorA;
            uniform vec3 colorB;
            varying vec2 vUv;
            void main() {
                gl_FragColor = vec4(mix(colorA, colorB, vUv.x), 1.0);
            }
        `,
        side: THREE.DoubleSide
    });
    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);

    waveScene.add(waveMesh);

    waveCamera.position.set(0, 0, 100);

    function animateWave() {
        requestAnimationFrame(animateWave);
        waveMaterial.uniforms.time.value += 0.05;
        waveRenderer.render(waveScene, waveCamera);
    }

    animateWave();
}

// Call the createWaveBanner function after the existing Three.js setup
createWaveBanner();
// Banner Slider
const banners = document.querySelectorAll('.banner');
let currentBanner = 0;

function showBanner(index) {
  banners.forEach((banner, i) => {
      banner.classList.remove('active');
      if (i === index) {
          banner.classList.add('active');
      }
  });
}

function nextBanner() {
  currentBanner = (currentBanner + 1) % banners.length;
  showBanner(currentBanner);
}

setInterval(nextBanner, 5000);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.product-card button');
let cartCount = 0;

addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
      cartCount++;
      updateCartCount();
      showAddedToCartMessage(button);
  });
});

function updateCartCount() {
  // You can update a cart icon or display the count somewhere in your HTML
  console.log(`Cart items: ${cartCount}`);
}

function showAddedToCartMessage(button) {
  const originalText = button.textContent;
  button.textContent = 'Added to Cart!';
  button.disabled = true;
  setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
  }, 2000);
}

// Form validation for newsletter signup (you can add this form in your HTML)
const newsletterForm = document.querySelector('#newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (validateEmail(emailInput.value)) {
          alert('Thank you for subscribing to our newsletter!');
          emailInput.value = '';
      } else {
          alert('Please enter a valid email address.');
      }
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Lazy loading images
const images = document.querySelectorAll('img[data-src]');
const config = {
  rootMargin: '50px 0px',
  threshold: 0.01
};

let observer = new IntersectionObserver((entries, self) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          preloadImage(entry.target);
          self.unobserve(entry.target);
      }
  });
}, config);

images.forEach(image => {
  observer.observe(image);
});

function preloadImage(img) {
  const src = img.getAttribute('data-src');
  if (!src) { return; }
  img.src = src;
}
setInterval(moveImages, 10);