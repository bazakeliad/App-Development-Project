// Function to send DELETE request using Ajax by jQuery
async function deleteOrder(orderId) {
    console.log('Deleting order with ID:', orderId); // Debugging log

    $.ajax({
        url: `/admin/orders/deleteOrderById/${orderId}`, // Adjusted for orders, not jerseys
        type: 'DELETE',
        success: function(result) {
            console.log('Order deleted successfully:', result); // Debugging log
            // On success, remove the order row from the table
            $(`#order_${orderId}`).remove();
            alert('Order deleted successfully');
        },
        error: function(err) {
            console.error('Error deleting order:', err); // Debugging log
            if (err.status === 401) {
                window.location.href = '/login'; // If unauthorized, redirect to login
            } else if (err.status === 403) {
                alert('Access Denied: Not Enough Permissions');
            } else if (err.status === 404) {
                alert('Order not found');
            } else {
                alert('Error deleting order. Please try again.');
            }
        }
    });
}

// Event listener for the delete button
$(document).on('click', '.deleteBtn', function() {
    const orderId = $(this).data('id'); // Get the order ID from the data-id attribute
    
    // Ask for confirmation
    if (confirm('Are you sure you want to delete this order?')) {
        deleteOrder(orderId); // Call the delete function only if confirmed
    }
});


$(document).ready(function() {
    // Handle the status change via AJAX
    $('.order-status').on('change', function() {
        const orderId = $(this).data('id');
        const newStatus = $(this).val();

        console.log(`Updating Order ID: ${orderId} to Status: ${newStatus}`); // Debugging

        $.ajax({
            url: `/admin/orders/updateStatus/${orderId}`,
            type: 'POST',
            data: { status: newStatus },
            contentType: 'application/x-www-form-urlencoded',  // Proper content type
            processData: true,
            success: function(response) {
                console.log('Status updated successfully:', response);
            },
            error: function(err) {
                console.error('Error updating status:', err.responseText);  // Log the exact error response
                alert('Failed to update the order status.');
            }
        });
    });
});
