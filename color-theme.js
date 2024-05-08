const Shades = [
  '#111111', // Very Dark Gray
  '#1A1A1A', // Dark Gray
  '#222222', // Dim Gray
  '#333333', // Charcoal
  '#444444', // Gray
  '#444444', // Gray
  '#333333', // Charcoal
  '#222222', // Dim Gray
  '#1A1A1A', // Dark Gray
  '#111111', // Very Dark Gray
];
  
let colorIndex = 0; 

function changeBackgroundColor() {
    const musicHead = document.querySelector('.container .music-head');
    musicHead.style.transition = 'background-color 0.8s ease'; 
    musicHead.style.background = Shades[colorIndex];
    colorIndex = (colorIndex + 1) % Shades.length; 
}

changeBackgroundColor();

setInterval(changeBackgroundColor, 7000);
