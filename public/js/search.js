// Search Button Click Event
document.getElementById('searchButton').addEventListener('click', function() {
    const searchQuery = document.getElementById('inpSearch').value;

    // If the search input is empty and not visible, open the input field
    if (!searchQuery && !document.getElementById('inpSearch').classList.contains('active')) {
        $('#inpSearch').addClass('active').focus();
        return; // Exit to avoid redirect
    }

    // Make sure the input is not empty before redirecting
    if (searchQuery) {
        // Split the search query into team and kit type
        const [team, kitType] = searchQuery.split(',').map(s => s.trim());

        // Construct the URL, encodeURIComponent ensures proper URL encoding
        const url = `/jerseys/browse?team=${encodeURIComponent(team)}&kitType=${encodeURIComponent(kitType)}`;

        // Redirect the browser to the constructed URL
        window.location.href = url;
    }
});

// Autocomplete Search Function
async function search() {
    const search = document.getElementById('inpSearch').value;

    // If the search input is empty, clear previous suggestions
    if (search.trim() === '') {
        document.getElementById('autocomplete_list').innerHTML = ''; // Clear previous suggestions
        return; // Exit the function
    }

    // Fetch search results from the server (adjust the API endpoint as needed)
    const res = await fetch(`http://localhost:80/apis/jerseys/team/${search}`);
    const results = await res.json();
    const autocomplete_list = document.getElementById('autocomplete_list');
    autocomplete_list.innerHTML = ''; // Clear previous suggestions

    // Display results in the autocomplete list
    if (results.length > 0) {
        results.forEach(result => {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item');
            const refined_result = result.team + ", " + result.kitType;
            item.innerText = refined_result; // Show team and kit type in the suggestion

            // When clicked, insert value into the input field
            item.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent hiding the search bar
                document.getElementById('inpSearch').value = refined_result;
                autocomplete_list.innerHTML = ''; // Clear the list after selection
            });

            autocomplete_list.appendChild(item);
        });
    }
}

// Display and Hide Search Input Logic
$(document).ready(function() {
    let searchVisible = false;

    // Toggle search input visibility
    $('#searchButton').click(function() {
        const searchQuery = $('#inpSearch').val();
        if (!searchVisible) {
            // Show search input
            $('#inpSearch').addClass('active').focus();
            searchVisible = true;
        } else if (searchVisible && searchQuery) {
            // If search input is visible and there's a query, trigger the search
            const searchQuery = document.getElementById('inpSearch').value;
            if (searchQuery) {
                const [team, kitType] = searchQuery.split(',').map(s => s.trim());
                const url = `/jerseys/browse?team=${encodeURIComponent(team)}&kitType=${encodeURIComponent(kitType)}`;
                window.location.href = url;
            }
        } else {
            // Hide search input
            $('#inpSearch').removeClass('active').val(''); // Clear search field when hiding
            $('#autocomplete_list').empty(); // Clear autocomplete list
            searchVisible = false;
        }
    });

    // Close the search when clicking outside the search field or search button
    $(document).click(function(e) {
        if (!$(e.target).closest('.search-wrapper, #searchButton, #autocomplete_list').length) {
            $('#inpSearch').removeClass('active').val(''); // Clear input when hiding
            $('#autocomplete_list').empty(); // Clear autocomplete list
            searchVisible = false;
        }
    });
});

// Attach the search function to the search input field (keyup event)
document.getElementById('inpSearch').onkeyup = search;