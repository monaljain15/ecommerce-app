// Form validation utilities

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

export interface PasswordStrength {
    score: number; // 0-4
    label: string; // Very Weak, Weak, Fair, Good, Strong
    color: string; // red, orange, yellow, blue, green
}

// Email validation
export const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
        return 'Email is required';
    }

    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }

    // Check for valid domain structure
    const domainPart = email.split('@')[1];
    if (!domainPart || domainPart.length < 3) {
        return 'Please enter a valid email address with a proper domain';
    }

    // Check for common invalid patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
        return 'Please enter a valid email address';
    }

    // Check for valid TLD (top-level domain)
    const tldRegex = /\.[a-zA-Z]{2,}$/;
    if (!tldRegex.test(domainPart)) {
        return 'Please enter a valid email address with a proper domain extension';
    }

    // Check for valid domain length
    if (domainPart.length > 253) {
        return 'Email domain is too long';
    }

    // Check for valid local part length
    const localPart = email.split('@')[0];
    if (localPart.length > 64) {
        return 'Email local part is too long';
    }

    // Check for valid characters in domain
    if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) {
        return 'Email domain contains invalid characters';
    }

    // Check for valid characters in local part
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
        return 'Email local part contains invalid characters';
    }

    return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
    if (!password) {
        return 'Password is required';
    }

    // Check minimum length
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }

    // Check maximum length for security
    if (password.length > 128) {
        return 'Password must be less than 128 characters';
    }

    // Check for at least one lowercase letter
    if (!/(?=.*[a-z])/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }

    // Check for at least one uppercase letter
    if (!/(?=.*[A-Z])/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }

    // Check for at least one number
    if (!/(?=.*\d)/.test(password)) {
        return 'Password must contain at least one number';
    }

    // Check for at least one special character
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
        return 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)';
    }

    // Check for common weak patterns
    if (/(.)\1{2,}/.test(password)) {
        return 'Password cannot contain more than 2 consecutive identical characters';
    }

    // Check for common weak passwords
    const commonPasswords = [
        'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
        'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1'
    ];

    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
        return 'Password is too common. Please choose a more secure password';
    }

    // Check for sequential patterns (only longer sequences to avoid being too strict)
    if (/(1234|2345|3456|4567|5678|6789|7890|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz)/i.test(password)) {
        return 'Password cannot contain sequential characters';
    }

    return null;
};

// Password strength calculator
export const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
        return { score: 0, label: 'Very Weak', color: 'red' };
    }

    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        long: password.length >= 12,
        veryLong: password.length >= 16
    };

    // Basic requirements
    if (checks.length) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.number) score += 1;
    if (checks.special) score += 1;

    // Bonus for length
    if (checks.long) score += 1;
    if (checks.veryLong) score += 1;

    // Penalty for common patterns
    if (/(.)\1{2,}/.test(password)) score -= 1;
    if (/(1234|2345|3456|4567|5678|6789|7890|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz)/i.test(password)) {
        score -= 1;
    }

    // Ensure score is between 0 and 4
    score = Math.max(0, Math.min(4, score));

    const strengthLevels = [
        { score: 0, label: 'Very Weak', color: 'red' },
        { score: 1, label: 'Weak', color: 'orange' },
        { score: 2, label: 'Fair', color: 'yellow' },
        { score: 3, label: 'Good', color: 'blue' },
        { score: 4, label: 'Strong', color: 'green' }
    ];

    return strengthLevels[score];
};

// Name validation
export const validateName = (name: string): string | null => {
    if (!name.trim()) {
        return 'Name is required';
    }
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters long';
    }
    if (name.trim().length > 50) {
        return 'Name must be less than 50 characters';
    }
    return null;
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) {
        return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return null;
};

// Login form validation
export const validateLoginForm = (email: string, password: string): ValidationResult => {
    const errors: ValidationError[] = [];

    const emailError = validateEmail(email);
    if (emailError) {
        errors.push({ field: 'email', message: emailError });
    }

    if (!password) {
        errors.push({ field: 'password', message: 'Password is required' });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Registration form validation
export const validateRegisterForm = (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
): ValidationResult => {
    const errors: ValidationError[] = [];

    const nameError = validateName(name);
    if (nameError) {
        errors.push({ field: 'name', message: nameError });
    }

    const emailError = validateEmail(email);
    if (emailError) {
        errors.push({ field: 'email', message: emailError });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        errors.push({ field: 'password', message: passwordError });
    }

    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) {
        errors.push({ field: 'confirmPassword', message: confirmPasswordError });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Reset password form validation
export const validateResetPasswordForm = (password: string, confirmPassword: string): ValidationResult => {
    const errors: ValidationError[] = [];

    const passwordError = validatePassword(password);
    if (passwordError) {
        errors.push({ field: 'password', message: passwordError });
    }

    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) {
        errors.push({ field: 'confirmPassword', message: confirmPasswordError });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Forgot password form validation
export const validateForgotPasswordForm = (email: string): ValidationResult => {
    const errors: ValidationError[] = [];

    const emailError = validateEmail(email);
    if (emailError) {
        errors.push({ field: 'email', message: emailError });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
