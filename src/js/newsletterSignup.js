document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const messageDiv = document.getElementById("newsletterMessage");

  // Check if already subscribed
  if (localStorage.getItem("newsletterSubscriber")) {
    showMessage("Thanks for being a subscriber!", "success");
  }

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    // Store in localStorage
    localStorage.setItem("newsletterSubscriber", email);

    // Show success message
    showMessage("Thanks for subscribing! You'll hear from us soon.", "success");

    // Clear the form
    emailInput.value = "";
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `newsletter-message ${type}`;
    messageDiv.classList.remove("hidden");

    // Hide message after 5 seconds
    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 5000);
  }
});
