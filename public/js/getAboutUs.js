// shabo added chihuahua button
async function getADog() {
    const res = await fetch(`https://dog.ceo/api/breed/chihuahua/images/random`)
    const dog = await res.json()
    document.getElementById('imgDog').src = dog.message
}

document.getElementById("btnGetADog").onclick = getADog