const beautifulColors = [
    '#FFD700', // Gold
    '#FFA07A', // Light Salmon
    '#FFC0CB', // Pink
    '#F08080', // Light Coral
    '#87CEEB', // Sky Blue
    '#20B2AA', // Light Sea Green
    '#9370DB', // Medium Purple
    '#FA8072', // Salmon
    '#FFDAB9', // Peachpuff
    '#00CED1', // Dark Turquoise
  ];
  
let colorIndex = 0; 

function changeBackgroundColor() {
    const musicHead = document.querySelector('.container .music-head');
    musicHead.style.transition = 'background-color 0.8s ease'; 
    musicHead.style.background = beautifulColors[colorIndex];
    colorIndex = (colorIndex + 1) % beautifulColors.length; 
}

changeBackgroundColor();

setInterval(changeBackgroundColor, 7000);
