// Search Button Click Event
document.getElementById('searchButton').addEventListener('click', function() {
    const searchQuery = document.getElementById('inpSearch').value;

    // If the search input is empty and not visible, open the input field
    if (!searchQuery && !document.getElementById('inpSearch').classList.contains('active')) {
        $('#inpSearch').addClass('active').focus();
        return;
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

        // Clear previous suggestions
        document.getElementById('autocomplete_list').innerHTML = '';
        return; // Exit the function
    }

    // Fetch search results from the server (adjust the API endpoint as needed)
    const res = await fetch(`http://localhost:80/apis/jerseys/team/${search}`);
    const results = await res.json();
    const autocomplete_list = document.getElementById('autocomplete_list');

    // Clear previous suggestions
    autocomplete_list.innerHTML = '';

    // Display results in the autocomplete list
    if (results.length > 0) {
        results.forEach(result => {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item');
            const refined_result = result.team + ", " + result.kitType;

            // Show team and kit type in the suggestion
            item.innerText = refined_result;

            // When clicked, insert value into the input field
            item.addEventListener('click', function(event) {

                // Prevent hiding the search bar
                event.stopPropagation();
                document.getElementById('inpSearch').value = refined_result;
                // Clear the list after selection
                autocomplete_list.innerHTML = '';
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

                let url = `/jerseys/browse?team=${encodeURIComponent(team)}`;
                // If kitType is defined and not empty, add it to the URL
                if (kitType) {
                    url += `&kitType=${encodeURIComponent(kitType)}`;
                }
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