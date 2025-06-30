// Landing page functionality
document.addEventListener("DOMContentLoaded", function () {
  // Check if user data already exists and redirect
  checkExistingUser();

  // Form elements
  const form = document.getElementById("registrationForm");
  const nameInput = document.getElementById("name");
  const dobInput = document.getElementById("dob");
  const submitBtn = document.getElementById("submitBtn");
  const nameError = document.getElementById("nameError");
  const dobError = document.getElementById("dobError");

  // Set max date to today
  const today = new Date().toISOString().split("T")[0];
  dobInput.max = today;

  // Form submission handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    // Validate form
    if (validateForm()) {
      // Save user data and redirect
      saveUserData();
      redirectToApp();
    }
  });

  // Real-time validation
  nameInput.addEventListener("input", function () {
    if (this.value.trim()) {
      nameError.textContent = "";
    }
  });

  dobInput.addEventListener("change", function () {
    if (this.value) {
      validateAge();
    }
  });

  function checkExistingUser() {
    try {
      const userData = localStorage.getItem("taskflow_user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.name && user.dateOfBirth && isValidAge(user.dateOfBirth)) {
          redirectToApp();
        }
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
      // Clear invalid data
      localStorage.removeItem("taskflow_user");
    }
  }

  function validateForm() {
    let isValid = true;

    // Validate name
    const name = nameInput.value.trim();
    if (!name) {
      nameError.textContent = "Please enter your full name";
      isValid = false;
    } else if (name.length < 2) {
      nameError.textContent = "Name must be at least 2 characters long";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      nameError.textContent = "Name can only contain letters and spaces";
      isValid = false;
    }

    // Validate date of birth
    const dob = dobInput.value;
    if (!dob) {
      dobError.textContent = "Please select your date of birth";
      isValid = false;
    } else if (!validateAge()) {
      isValid = false;
    }

    return isValid;
  }

  function validateAge() {
    const dob = dobInput.value;
    if (!dob) return false;

    console.log("DOB entered:", dob); // ADD THIS LINE

    if (!isValidAge(dob)) {
      dobError.textContent = "You must be over 10 years old to use TaskFlow";
      return false;
    }

    dobError.textContent = "";
    return true;
  }

  function isValidAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    // Check if birth date is in the future
    if (birthDate >= today) {
      return false;
    }

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age > 10;
  }

  function clearErrors() {
    nameError.textContent = "";
    dobError.textContent = "";
  }

  function saveUserData() {
    const userData = {
      name: nameInput.value.trim(),
      dateOfBirth: dobInput.value,
      registrationDate: new Date().toISOString(),
    };

    try {
      localStorage.setItem("taskflow_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("There was an error saving your information. Please try again.");
    }
  }

  function redirectToApp() {
    // Add a small delay for better UX
    const submitButton = document.getElementById("submitBtn");
    if (submitButton) {
      submitButton.textContent = "Loading...";
      submitButton.disabled = true;
    }

    setTimeout(() => {
      window.location.href = "app.html";
    }, 500);
  }
});
