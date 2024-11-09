async function getADog() {
    const res = await fetch(`https://dog.ceo/api/breed/chihuahua/images/random`)
    const dog = await res.json()
    document.getElementById('imgDog').src = dog.message
}

document.getElementById("btnGetADog").onclick = getADog

function drawSmileyFace() {
    const canvas = document.getElementById('smileyCanvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas before drawing to reset any previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Face
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFEB3B';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4; 
    ctx.stroke();

    // Eyes
    ctx.beginPath();
    ctx.arc(70, 80, 10, 0, 2 * Math.PI); // Left eye
    ctx.arc(130, 80, 10, 0, 2 * Math.PI); // Right eye
    ctx.fillStyle = '#333';
    ctx.fill();

    // Mouth (smile)
    ctx.beginPath();
    ctx.arc(100, 110, 40, 0, Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();
}

// Button Click Event to Show Canvas and Draw Smiley
document.getElementById('getSmiley').addEventListener('click', function() {
    const smileyContainer = document.getElementById('smileyContainer');
    smileyContainer.style.display = 'block';  // Show the canvas container
    drawSmileyFace(); 
});