// Form elements
const paymentForm = document.getElementById('paymentForm');
const callbackForm = document.getElementById('callbackForm');

// Credit card validation patterns
const CARD_PATTERNS = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/
};

// Show/Hide Payment Form
function showPaymentForm() {
    paymentForm.classList.remove('hidden');
    callbackForm.classList.add('hidden');
    scrollToForm(paymentForm);
}

function hidePaymentForm() {
    paymentForm.classList.add('hidden');
}

// Show/Hide Callback Form
function showCallbackForm() {
    callbackForm.classList.remove('hidden');
    paymentForm.classList.add('hidden');
    scrollToForm(callbackForm);
}

function hideCallbackForm() {
    callbackForm.classList.add('hidden');
}

// Smooth scroll to form
function scrollToForm(form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Credit card type detection and formatting
const cardNumberInput = document.getElementById('cardNumber');
cardNumberInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format card number with spaces
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    if (value.length > 16) value = value.slice(0, 16);
    e.target.value = formattedValue;
    
    // Detect and validate card type
    let cardType = detectCardType(value);
    updateCardTypeUI(cardType);
});

function detectCardType(number) {
    if (CARD_PATTERNS.visa.test(number)) return 'visa';
    if (CARD_PATTERNS.mastercard.test(number)) return 'mastercard';
    if (CARD_PATTERNS.amex.test(number)) return 'amex';
    return null;
}

function updateCardTypeUI(cardType) {
    const cardTypeDisplay = document.getElementById('cardType');
    if (cardType) {
        cardTypeDisplay.textContent = cardType.toUpperCase();
        cardTypeDisplay.style.color = 'var(--success-color)';
    } else {
        cardTypeDisplay.textContent = 'Invalid card';
        cardTypeDisplay.style.color = 'var(--error-color)';
    }
}

// Expiry date formatting and validation
const expiryInput = document.getElementById('expiry');
expiryInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
    
    // Validate expiry date
    if (value.length === 5) {
        validateExpiryDate(value);
    }
});

function validateExpiryDate(value) {
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    const isValid = 
        expMonth >= 1 && 
        expMonth <= 12 && 
        (expYear > currentYear || 
            (expYear === currentYear && expMonth >= currentMonth));
    
    expiryInput.setCustomValidity(isValid ? '' : 'Invalid expiry date');
    
    // Update UI
    expiryInput.style.borderColor = isValid ? 'var(--border-color)' : 'var(--error-color)';
}

// CVV validation
const cvvInput = document.getElementById('cvv');
cvvInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    e.target.value = value;
    
    // Validate CVV length based on card type
    const cardNumber = cardNumberInput.value.replace(/\D/g, '');
    const cardType = detectCardType(cardNumber);
    const isValidLength = cardType === 'amex' ? value.length === 4 : value.length === 3;
    
    cvvInput.setCustomValidity(isValidLength ? '' : `CVV must be ${cardType === 'amex' ? '4' : '3'} digits`);
    cvvInput.style.borderColor = isValidLength ? 'var(--border-color)' : 'var(--error-color)';
});

// Luhn algorithm for card number validation
function validateCardNumber(number) {
    let sum = 0;
    let isEven = false;
    
    // Loop through values starting from the right
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    e.target.value = value;
});

// Form submissions with enhanced validation
paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cardNumber = cardNumberInput.value.replace(/\D/g, '');
    const cardType = detectCardType(cardNumber);
    const isValidLuhn = validateCardNumber(cardNumber);
    
    if (!cardType) {
        alert('Please enter a valid card number');
        return;
    }
    
    if (!isValidLuhn) {
        alert('Invalid card number');
        return;
    }
    
    // Here you would typically integrate with your payment processing service
    alert('Payment details validated successfully! You will be redirected to the payment processor.');
});

callbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Here you would typically send this to your backend
    alert('Callback request received! An account manager will contact you at your preferred time.');
}); 