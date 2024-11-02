let deleteOrderId = null;

$(document).ready(function() {
    // Event listener for the delete button
    $(document).on('click', '.deleteBtn', function() {
        deleteOrderId = $(this).data('id'); // Store order ID
        const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        modal.show();
    });

    // Confirm delete button in modal
    $('#confirmDeleteBtn').on('click', function() {
        if (deleteOrderId) {
            $.ajax({
                url: `/orders/deleteOrderById/${deleteOrderId}`,
                type: 'DELETE',
                success: function() {
                    $(`#order_${deleteOrderId}`).remove();
                    showToast('Order deleted successfully!', 'success');
                },
                error: function(err) {
                    if (err.status === 401) {
                        window.location.href = '/login';
                    } else if (err.status === 403) {
                        showToast('Access Denied: Not Enough Permissions', 'error');
                    } else if (err.status === 404) {
                        showToast('Order not found', 'error');
                    } else {
                        showToast('Error deleting order. Please try again.', 'error');
                    }
                }
            });
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
            modal.hide();
        }
    });

    // Handle the status change via AJAX
    $('.order-status').on('change', function() {
        const orderId = $(this).data('id');
        const newStatus = $(this).val();

        $.ajax({
            url: `/admin/orders/updateStatus/${orderId}`,
            type: 'POST',
            data: { status: newStatus },
            contentType: 'application/x-www-form-urlencoded',
            processData: true,
            success: function() {
                showToast('Order status updated successfully!', 'success');
            },
            error: function() {
                showToast('Failed to update the order status.', 'error');
            }
        });
    });
});

// Function to display toast notifications
function showToast(message, type) {
    const toastEl = document.getElementById('statusToast');
    const toastBody = document.getElementById('toastBody');
    toastBody.textContent = message;

    toastEl.classList.remove('text-bg-success', 'text-bg-danger');
    toastEl.classList.add(type === 'success' ? 'text-bg-success' : 'text-bg-danger');
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
