document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');

    // Input elements
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const mobileInput = document.getElementById('reg-mobile');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    const courseSelect = document.getElementById('reg-course');
    const yearSelect = document.getElementById('reg-year');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const termsCheckbox = document.getElementById('reg-terms');
    const successBanner = document.getElementById('success-banner');

    // Regular Expression patterns
    const regexPatterns = {
        // Name: Letters, spaces, min 3, max 50 chars
        name: /^[a-zA-Z\s]{3,50}$/,
        
        // Email: Standard RFC-compliant format
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        
        // Mobile: 10-digit Indian/standard mobile format starting with 6-9
        mobile: /^[6-9]\d{9}$/,
        
        // Password: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        
        // Course & Year: Non-empty selection check
        course: /^.+$/,
        year: /^[1-4]$/
    };

    // Helper functions for UI error feedback
    function showError(input, errorElementId, message) {
        if (input && input.classList) {
            input.classList.add('invalid');
            input.classList.remove('valid');
        }
        const errorElem = document.getElementById(errorElementId);
        if (errorElem) {
            errorElem.textContent = message;
        }
    }

    function clearError(input, errorElementId) {
        if (input && input.classList) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        }
        const errorElem = document.getElementById(errorElementId);
        if (errorElem) {
            errorElem.textContent = '';
        }
    }

    // Individual Validation Functions
    function validateName() {
        const value = nameInput.value.trim();
        if (!value) {
            showError(nameInput, 'name-error', 'Full name is required.');
            return false;
        }
        if (!regexPatterns.name.test(value)) {
            showError(nameInput, 'name-error', 'Name must be 3-50 letters only.');
            return false;
        }
        clearError(nameInput, 'name-error');
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        if (!value) {
            showError(emailInput, 'email-error', 'Email address is required.');
            return false;
        }
        if (!regexPatterns.email.test(value)) {
            showError(emailInput, 'email-error', 'Enter a valid email address (e.g., student@univ.edu).');
            return false;
        }
        clearError(emailInput, 'email-error');
        return true;
    }

    function validateMobile() {
        const value = mobileInput.value.trim();
        if (!value) {
            showError(mobileInput, 'mobile-error', 'Mobile number is required.');
            return false;
        }
        if (!regexPatterns.mobile.test(value)) {
            showError(mobileInput, 'mobile-error', 'Enter a valid 10-digit mobile number starting with 6-9.');
            return false;
        }
        clearError(mobileInput, 'mobile-error');
        return true;
    }

    function validatePassword() {
        const value = passwordInput.value;
        if (!value) {
            showError(passwordInput, 'password-error', 'Password is required.');
            return false;
        }
        if (!regexPatterns.password.test(value)) {
            showError(passwordInput, 'password-error', 'Min 8 chars: 1 uppercase, 1 lowercase, 1 number, 1 symbol (@$!%*?&).');
            return false;
        }
        clearError(passwordInput, 'password-error');
        return true;
    }

    function validateConfirmPassword() {
        const value = confirmPasswordInput.value;
        if (!value) {
            showError(confirmPasswordInput, 'confirm-password-error', 'Please confirm your password.');
            return false;
        }
        if (value !== passwordInput.value) {
            showError(confirmPasswordInput, 'confirm-password-error', 'Passwords do not match.');
            return false;
        }
        clearError(confirmPasswordInput, 'confirm-password-error');
        return true;
    }

    function validateCourse() {
        const value = courseSelect.value;
        if (!regexPatterns.course.test(value)) {
            showError(courseSelect, 'course-error', 'Please select a course.');
            return false;
        }
        clearError(courseSelect, 'course-error');
        return true;
    }

    function validateYear() {
        const value = yearSelect.value;
        if (!regexPatterns.year.test(value)) {
            showError(yearSelect, 'year-error', 'Please select your current year.');
            return false;
        }
        clearError(yearSelect, 'year-error');
        return true;
    }

    function validateGender() {
        const isChecked = Array.from(genderInputs).some(radio => radio.checked);
        const errorElem = document.getElementById('gender-error');
        if (!isChecked) {
            errorElem.textContent = 'Please select your gender.';
            return false;
        }
        errorElem.textContent = '';
        return true;
    }

    function validateTerms() {
        const errorElem = document.getElementById('terms-error');
        if (!termsCheckbox.checked) {
            errorElem.textContent = 'You must accept the terms and conditions.';
            return false;
        }
        errorElem.textContent = '';
        return true;
    }

    // Real-time / Blur event listeners
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', () => { if (nameInput.classList.contains('invalid')) validateName(); });

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => { if (emailInput.classList.contains('invalid')) validateEmail(); });

    mobileInput.addEventListener('blur', validateMobile);
    mobileInput.addEventListener('input', () => { if (mobileInput.classList.contains('invalid')) validateMobile(); });

    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', () => {
        if (passwordInput.classList.contains('invalid')) validatePassword();
        if (confirmPasswordInput.value) validateConfirmPassword();
    });

    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    confirmPasswordInput.addEventListener('input', () => { if (confirmPasswordInput.classList.contains('invalid')) validateConfirmPassword(); });

    courseSelect.addEventListener('change', validateCourse);
    yearSelect.addEventListener('change', validateYear);

    genderInputs.forEach(radio => radio.addEventListener('change', validateGender));
    termsCheckbox.addEventListener('change', validateTerms);

    // Form Submission Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Run all validators
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMobileValid = validateMobile();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isCourseValid = validateCourse();
        const isYearValid = validateYear();
        const isGenderValid = validateGender();
        const isTermsValid = validateTerms();

        const isFormValid = isNameValid && isEmailValid && isMobileValid &&
                            isPasswordValid && isConfirmPasswordValid &&
                            isCourseValid && isYearValid && isGenderValid && isTermsValid;

        if (isFormValid) {
            form.submit();
        } else {
            // Scroll to the first invalid field
            const firstInvalid = form.querySelector('.invalid, input:invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
});