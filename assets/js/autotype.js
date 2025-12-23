document.addEventListener("DOMContentLoaded", function() {
  const roles = ["Frontend Developer", "Backend Developer", "Photo Editor"];
  let currentRoleIndex = 0;
  let currentCharIndex = 0;
  const typingSpeed = 100;  // Speed of typing
  const deletingSpeed = 50; // Speed of deleting
  const pauseTime = 1000;   // Pause time before switching roles

  const typedTextElement = document.getElementById('typed-text');

  function type() {
    const currentRole = roles[currentRoleIndex];
    typedTextElement.textContent = currentRole.slice(0, currentCharIndex + 1);
    currentCharIndex++;

    if (currentCharIndex === currentRole.length) {
      setTimeout(deleteText, pauseTime); // Pause before deleting
    } else {
      setTimeout(type, typingSpeed);
    }
  }

  function deleteText() {
    const currentRole = roles[currentRoleIndex];
    typedTextElement.textContent = currentRole.slice(0, currentCharIndex - 1);
    currentCharIndex--;

    if (currentCharIndex === 0) {
      currentRoleIndex = (currentRoleIndex + 1) % roles.length; // Loop through roles
      setTimeout(type, pauseTime); // Start typing the next role
    } else {
      setTimeout(deleteText, deletingSpeed);
    }
  }

  type(); // Start typing when the page loads
});
