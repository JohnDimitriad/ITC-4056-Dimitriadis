$(document).ready(function () {
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();

        // Capture form details
        const name = $('#name').val();
        const email = $('#email').val();
        const subject = $('#subject').val();
        const message = $('#message').val();

        // Display form details in an alert
        alert(`Thank you, ${name}. Your message has been sent to us via your email address: ${email}.`);
        
        // Reset form fields
        this.reset();
    });
});
