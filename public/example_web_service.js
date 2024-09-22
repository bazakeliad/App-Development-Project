// AJAX and web service



async function getARandomDog() {
    const breed = document.getElementById('selectBreeds').value
    const res = await fetch('https://dog.ceo/api/breeds/image/random')
    const dog = await res.json()
    document.getElementById('imgDog').src = dog.message
}

document.getElementById("btnGetADog").onclick = getARandomDog;




async function getADog() {
    const breed = document.getElementById('selectBreeds').value
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
    const dog = await res.json()
    document.getElementById('imgDog').src = dog.message
}

async function GetAllBreeds(){
    const res = await fetch('https://dog.ceo/api/breeds/list/all')
    // save the responso of all the breeds as a json. json method it is on fetch output object.
    const breeds = await res.json()

    for(breed in breeds.message){    
        // create an each option element inside the select
        const option = document.createElement('option')
        option.value = breed
        option.innerText = breed
        document.getElementById('selectBreeds').appendChild(option)
    }
      
}

document.getElementById("selectBreeds").onchange = getADog

GetAllBreeds()


// auto fill
async function search(){
    const search = document.getElementById('inpSearch').value

        // If the search input is empty, don't fetch or display anything
        if (search.trim() === '') {
            document.getElementById('autocomplete_list').innerHTML = ''; // Clear previous suggestions
            return; // Exit the function
        }
    

    const res = await fetch(`http://localhost:80/apis/search/${search}`)
    const results = await res.json()
    console.log(results.team)
    const autocomplete_list = document.getElementById('autocomplete_list')
    autocomplete_list.innerHTML = ''; // Clear previous suggestions


    if (results.length > 0) {
        results.forEach(result => {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item');
            item.innerText = result.team; // Assuming result has a 'team' field

            // When clicked, insert value into the input field
            item.addEventListener('click', function() {
                document.getElementById('inpSearch').value = result.team;
                autocomplete_list.innerHTML = ''; // Clear the list after selection
            });

            autocomplete_list.appendChild(item);
        });
    }
}

document.getElementById('inpSearch').onkeyup = search
