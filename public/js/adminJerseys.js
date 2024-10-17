// Function to send DELETE request using Ajax by JQUERY
async function deleteResource(jerseyId) {
    $.ajax({
        url: `/jerseys/${jerseyId}`,
        type: 'DELETE',
        success: function(result) {
            // On success, remove the item from the DOM
            $(`#jersey_${jerseyId}`).remove();
        },
        error: function(err) {
            if (err.status === 401) {
                // If 401 Unauthorized, redirect to the login page
                window.location.href = '/login';
            } else if (err.status === 403) {
                // If 403 Forbidden, alert the user about access denial
                alert('Access Denied: Not Enough Permissions');
            } else {
                console.log('Error:', err);
            }
        }
    });
}

// Event listener for the delete button
$('.deleteBtn').on('click', function() {
    const jerseyId = this.getAttribute('data-id'); // Get the jersey ID from the data attribute
    
    // Ask for confirmation
    if (confirm('Are you sure you want to delete this jersey?')) {
        deleteResource(jerseyId); // Call the delete function only if confirmed
    }
});