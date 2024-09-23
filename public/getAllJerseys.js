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
    const jerseyId = this.getAttribute('data-id'); // Get the team ID from the data attribute
    deleteResource(jerseyId); // Call the delete function
});




// // POST to /articles AJAX, another form of syntax
// async function create(team) {
//     const res = await fetch('http://localhost:80/jerseys', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ team })
//     });
//     const json = await res.json();
//     console.log(json);
// }
  

