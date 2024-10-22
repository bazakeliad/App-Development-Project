// Function to send DELETE request using Ajax by jQuery
async function deleteUser(userId) {
    $.ajax({
        url: `/admin/users/${userId}`,
        type: 'DELETE',
        success: function(result) {
            // On success, remove the user from the DOM
            $(`#user_${userId}`).remove();
        },
        error: function(err) {
            console.log('Error:', err);
        }
    });
}

// Event listener for the delete button
$('.deleteBtn').on('click', function() {
    const userId = this.getAttribute('data-id'); // Get the user ID from the data attribute
    
    // Ask for confirmation
    if (confirm('Are you sure you want to delete this user?')) {
        deleteUser(userId); // Call the delete function only if confirmed
    }
});
