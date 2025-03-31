const canvas = document.getElementById("nebulaCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gradientOffset = 0;
let mouseX = canvas.width / 2; // Start at center
let mouseY = canvas.height / 2; // Start at center
let noiseIntensity = 50; // Default noise intensity

// Update mouse position when the mouse moves
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Create a slider for noise intensity control
const noiseSlider = document.createElement("input");
noiseSlider.type = "range";
noiseSlider.min = "0";
noiseSlider.max = "100";
noiseSlider.value = noiseIntensity;
noiseSlider.style.position = "absolute";
noiseSlider.style.top = "15px";
noiseSlider.style.left = "10px";
noiseSlider.style.width = "120px"; // Set the width of the slider
document.body.appendChild(noiseSlider);

// Function to update the slider's appearance based on the theme
function updateSliderStyle() {
  const currentTheme = document.body.getAttribute("data-theme");
  if (currentTheme === "dark") {
    noiseSlider.style.setProperty("--thumb-color", "#fff"); // Light thumb
    noiseSlider.style.setProperty("--slider-track-color", "#555"); // Dark track
  } else {
    noiseSlider.style.setProperty("--thumb-color", "#000"); // Dark thumb
    noiseSlider.style.setProperty("--slider-track-color", "#ddd"); // Light track
  }
}

// Update noise intensity on slider input
noiseSlider.addEventListener("input", (e) => {
  noiseIntensity = e.target.value;
});

// Initial slider styling
updateSliderStyle();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  createNebula(gradientOffset);
  addNoise();

  // Increment the offset continuously to create a seamless loop
  gradientOffset += 0.5; // Adjust this value for speed
  if (gradientOffset > canvas.width) {
    gradientOffset = 0; // Reset the offset to create a looping effect
  }

  requestAnimationFrame(animate);
}

function createNebula(offset) {
  // Central nebula based on mouse position
  const gradient = ctx.createRadialGradient(
    mouseX,
    mouseY,
    50 + offset,
    mouseX,
    mouseY,
    canvas.width / 2 + offset
  );
  gradient.addColorStop(0, "rgba(72, 0, 72, 0.8)");
  gradient.addColorStop(0.3, "rgba(139, 0, 139, 0.6)");
  gradient.addColorStop(0.5, "rgba(255, 20, 147, 0.4)");
  gradient.addColorStop(0.7, "rgba(255, 140, 0, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Second nebula that moves with the gradient offset
  const gradient2 = ctx.createRadialGradient(
    canvas.width / 3 + offset,
    canvas.height / 3 + offset,
    50,
    canvas.width / 3 + offset,
    canvas.height / 3 + offset,
    canvas.width / 2
  );
  gradient2.addColorStop(0, "rgba(0, 0, 255, 0.4)");
  gradient2.addColorStop(0.5, "rgba(0, 255, 255, 0.2)");
  gradient2.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Third nebula that moves inversely with the gradient offset
  const gradient3 = ctx.createRadialGradient(
    (2 * canvas.width) / 3 - offset,
    (2 * canvas.height) / 3 - offset,
    50,
    (2 * canvas.width) / 3 - offset,
    (2 * canvas.height) / 3 - offset,
    canvas.width / 2
  );
  gradient3.addColorStop(0, "rgba(0, 255, 0, 0.4)");
  gradient3.addColorStop(0.5, "rgba(255, 255, 0, 0.2)");
  gradient3.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient3;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function addNoise() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * noiseIntensity;
    data[i] += noise; // Red
    data[i + 1] += noise; // Green
    data[i + 2] += noise; // Blue
  }
  ctx.putImageData(imageData, 0, 0);
}

// Start the animation
animate();

// Theme Toggle Logic
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.body.removeAttribute("data-theme");
    themeToggle.textContent = "☾"; // Set icon to moon for dark mode
  } else {
    document.body.setAttribute("data-theme", "dark");
    themeToggle.textContent = "𖤓"; // Set icon to sun for light mode
  }
  updateSliderStyle(); // Update slider style on theme toggle
});
