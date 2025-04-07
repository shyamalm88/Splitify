/**
 * Validates email format
 *
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 *
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.validatePassword = (password) => {
  // Minimum 8 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates phone number format (E.164 format)
 *
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.validatePhoneNumber = (phoneNumber) => {
  // E.164 format: +[country code][number]
  // Example: +14155552671
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Formats the phone number to E.164 format
 *
 * @param {string} phoneNumber - Phone number to format
 * @param {string} defaultCountryCode - Default country code to use if not provided
 * @returns {string} - Formatted phone number
 */
exports.formatPhoneNumber = (phoneNumber, defaultCountryCode = "1") => {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  // Check if the phone number already has the + prefix
  if (phoneNumber.startsWith("+")) {
    return `+${digitsOnly}`;
  }

  // Check if the phone number starts with the country code
  if (phoneNumber.startsWith(defaultCountryCode)) {
    return `+${digitsOnly}`;
  }

  // Add the default country code
  return `+${defaultCountryCode}${digitsOnly}`;
};

/**
 * Generate a random 6-digit OTP
 *
 * @returns {string} - 6-digit OTP
 */
exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Checks if a value is a valid MongoDB ObjectId
 *
 * @param {string} id - ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
