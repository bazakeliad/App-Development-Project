document.getElementById('searchButton').addEventListener('click', function() {
    const searchQuery = document.getElementById('inpSearch').value;

    // Make sure the input is not empty
    if (searchQuery) {
      // Split the search query into team and kit type
      const [team, kitType] = searchQuery.split(',').map(s => s.trim());
      
      // Construct the URL, encodeURIComponent ensures proper URL encoding
      const url = `/jerseys?team=${encodeURIComponent(team)}&kitType=${encodeURIComponent(kitType)}`;
      
      // Redirect the browser to the constructed URL
      window.location.href = url;
    }
});

//--------------------------------------------------------------------------
// added auto search
async function search(){
    const search = document.getElementById('inpSearch').value

    // If the search input is empty, don't fetch or display anything
    if (search.trim() === '') {
        document.getElementById('autocomplete_list').innerHTML = ''; // Clear previous suggestions
        return; // Exit the function
    }


    const res = await fetch(`http://localhost:80/apis/jerseys/team/${search}`)
    const results = await res.json()
    const autocomplete_list = document.getElementById('autocomplete_list')
    autocomplete_list.innerHTML = ''; // Clear previous suggestions


    if (results.length > 0) {
        results.forEach(result => {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item');
            refined_result = result.team + ", " + result.kitType
            item.innerText = refined_result; // Assuming result has a 'team' field
            // When clicked, insert value into the input field
            item.addEventListener('click', function() {
                document.getElementById('inpSearch').value = refined_result;
                autocomplete_list.innerHTML = ''; // Clear the list after selection
            });

            autocomplete_list.appendChild(item);
        });
    }
}

document.getElementById('inpSearch').onkeyup = search