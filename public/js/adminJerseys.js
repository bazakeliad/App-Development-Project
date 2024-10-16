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
            console.log('Error:', err);
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