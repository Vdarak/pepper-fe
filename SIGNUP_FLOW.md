# Pepper Signup and Email Verification Flow

## Overview
This document outlines the complete user signup and email verification flow implemented in the Pepper application.

## Flow Summary

### 1. Initial Signup (`/`)
- User enters their email address
- Application calls `POST /user/signup/request` with `{ "email": "user@example.com" }`
- On success, user is redirected to email verification page

### 2. Email Verification Page (`/verify-email`)
- Shows the email address verification was sent to
- Displays instructions for checking email
- Provides option to resend verification email (60-second cooldown)
- Allows user to change email address if needed
- Uses same API endpoint for resending: `POST /user/signup/request`

### 3. Email Verification Link
- User receives email with verification link containing token
- Link format: `/verify?token=<verification_token>`
- Token is extracted from URL and sent to backend for verification

### 4. Token Verification (`/verify`)
- Calls `GET /user/signup/verify?token=<token>` to verify the token
- **Success**: Shows success message and redirects to account setup
- **Error**: Shows error page with retry option and "Start Again" button

### 5. Account Setup (`/account-setup`)
- Multi-step form with Pepper personality and guidance
- **Step 1**: Personal Information (first_name, last_name)
- **Step 2**: Address Details (address, city, state, country, postal code)
- **Step 3**: Contact & Security (phone number with country code, password)
- Calls `POST /user/signup/account-setup` with complete user data

### 6. Dashboard (`/dashboard`)
- Welcome page after successful account creation
- Shows success message confirming account verification and setup

## API Endpoints Used

### 1. Signup Request
```
POST /user/signup/request
Body: { "email": "user@example.com" }
```

### 2. Token Verification
```
GET /user/signup/verify?token=<verification_token>
Response: { "email": "user@example.com", ...other_data }
```

### 3. Account Setup
```
POST /user/signup/account-setup
Body: {
  "email": "user@example.com",
  "first_name": "string",
  "last_name": "string", 
  "address_line1": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "pin": "string",
  "country_code": "string",
  "contact_number": "string",
  "password": "string"
}
```

## Key Features

### User Experience
- **Pepper Personality**: Friendly, engaging copy throughout the flow
- **Progressive Disclosure**: Multi-step form breaks down complex signup
- **Error Handling**: Clear error messages and recovery options
- **Accessibility**: Proper form validation and user feedback

### Technical Features
- **Form Validation**: Client-side validation with real-time feedback
- **State Management**: Proper form state and error handling
- **Responsive Design**: Works on all device sizes
- **TypeScript**: Fully typed for better development experience

### Address Handling
- **US-Specific**: States dropdown for US addresses
- **International**: Text input for non-US state/province
- **Country Selection**: Comprehensive country dropdown

### Phone Number Support
- **International**: Country code dropdown with 40+ countries
- **Default US**: +1 country code as default
- **Validation**: Proper phone number format validation

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Initial signup page
│   ├── verify-email/page.tsx       # Email verification waiting page
│   ├── verify/page.tsx             # Token verification handler
│   ├── account-setup/page.tsx      # Multi-step account setup
│   ├── dashboard/page.tsx          # Success/welcome page
│   └── test-email/page.tsx         # Development testing page
├── components/
│   ├── ui/
│   │   └── select.tsx              # Select dropdown component
│   └── error-page.tsx              # Reusable error component
└── lib/
    ├── api.ts                      # API utility functions
    ├── data.ts                     # US states, countries, country codes
    └── utils.ts                    # Utility functions
```

## Testing

### Development Testing
- Visit `/test-email` to see email simulation
- Test verification flow with sample token
- Test all form validation scenarios

### API Testing
- Ensure backend endpoints match the expected format
- Test error scenarios (invalid tokens, etc.)
- Verify proper redirect flows

## Error Scenarios Handled

1. **Invalid/Expired Token**: Shows error page with retry option
2. **Network Errors**: User-friendly error messages
3. **Form Validation**: Real-time validation feedback
4. **API Failures**: Proper error handling and user guidance

## Next Steps

1. **Backend Integration**: Connect to actual API endpoints
2. **Email Templates**: Design actual email templates
3. **Session Management**: Implement proper authentication
4. **Testing**: Add comprehensive test coverage
5. **Analytics**: Track conversion rates through the funnel

## Development URLs

- Main App: http://localhost:3001
- Email Simulator: http://localhost:3001/test-email
- Verification Test: http://localhost:3001/verify?token=sample_token