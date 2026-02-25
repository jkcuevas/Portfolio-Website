document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    
    // Show loading indicator
    document.getElementById('loading').style.display = 'flex';  // Show loader
    
    // Collect form data
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    // Validate the data
    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        document.getElementById('loading').style.display = 'none'; // Hide loader if fields are not filled
        return;
    }

    // Prepare data to send to backend
    const formData = {
        name: name,
        email: email,
        message: message
    };

    // Backend URL
    const backendUrl = 'http://localhost:3000/send-message';

    // Send the data to the backend
    fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Hide the loading spinner
        document.getElementById('loading').style.display = 'none';

        // If successful, show success message
        if (data.success) {
            const successNotification = document.getElementById('success-notification');
            successNotification.style.display = 'flex'; // Make sure notification is visible
            successNotification.classList.add('show'); // Trigger fade-in and scaling animation

            // Event listener to hide the notification when Continue button is clicked
            document.getElementById('continue-button').addEventListener('click', function() {
                successNotification.style.display = 'none'; // Hide the notification
                successNotification.classList.remove('show'); // Remove the animation class
            });

            document.getElementById('contactForm').reset(); // Reset form after submission
        } else {
            alert("There was an issue sending your message. Please try again.");
        }
    })
    .catch(error => {
        // Hide loading indicator in case of error
        document.getElementById('loading').style.display = 'none';

        console.error("Error:", error);
        alert("There was an error with the submission. Please try again.");
    });
});