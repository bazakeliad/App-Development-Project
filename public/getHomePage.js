// Show or hide the new input field for update operation
$('#operation').on('change', function() {
    if ($(this).val() === 'create') {
        // $('#updateInputField').show();
        $('#readInputField').show();
    } else {
        // $('#updateInputField').hide();
        $('#readInputField').hide();
    }
});

// $('#updateInputField').hide();
$('#readInputField').hide();