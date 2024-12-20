// Function to send DELETE request using Ajax by jQuery
async function deleteReview(reviewId) {
    $.ajax({
        url: `/admin/reviews/${reviewId}`,
        type: 'DELETE',
        success: function(result) {

            // On success, remove the review from the DOM
            $(`#review_${reviewId}`).remove();
        },
        error: function(err) {
            console.log('Error:', err);
        }
    });
}

// Event listener for the delete button
$('.deleteBtn').on('click', function() {

     // Get the review ID from the data attribute
    const reviewId = this.getAttribute('data-id');
    
    // Ask for confirmation
    if (confirm('Are you sure you want to delete this review?')) {
        deleteReview(reviewId);
    }
});
