let storeId = null;

$(document).ready(function() {

    // Event listener for the delete button
    $(document).on('click', '.deleteBtn', function() {
        storeId = $(this).data('id');
        const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        modal.show();
    });

    // Confirm delete button in modal
    $('#confirmDeleteBtn').on('click', function() {
        if (storeId) {
            $.ajax({
                url: '/admin/stores/delete/' + storeId,
                type: 'DELETE',
                success: function() {
                    $(`#store_${storeId}`).remove();
                    showToast('Store deleted successfully!', 'success');
                },
                error: function(err) {
                    if (err.status === 401) {
                        window.location.href = '/login';
                    } else if (err.status === 403) {
                        showToast('Access Denied: Not Enough Permissions', 'error');
                    } else if (err.status === 404) {
                        showToast('Store not found', 'error');
                    } else {
                        showToast('Error deleting store. Please try again.', 'error');
                    }
                }
            });
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
            modal.hide();
        }
    });
    
        // Check URL parameters for message and type to show a toast notification on page load
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message');
        const type = urlParams.get('type');
    
        if (message) {
            showToast(message, type === 'success' ? 'success' : 'error');
        }
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