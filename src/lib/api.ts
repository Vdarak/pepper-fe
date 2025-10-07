/**
 * API utility functions for the Pepper application
 */

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

interface AccountSetupData {
  first_name: string;
  last_name: string;
  address_line1: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  country_code: string;
  contact_number: string;
  password: string;
}

interface UserPreferencesData {
  job_title: string;
  commitment: string;
  part_time: boolean;
  full_time: boolean;
  internship: boolean;
  contract: boolean;
  visa_sponsorship: boolean;
  location: string;
  pay_yearly_max: string;
  pay_yearly_min: string;
  pay_hourly_max: string;
  pay_hourly_min: string;
  goal_choice: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get the API base URL from localStorage or default
 */
function getApiUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api'; // Default for SSR
  }
  return localStorage.getItem("pepper-api-url") || "http://localhost:8000/api";
}

/**
 * Make an API request with proper error handling
 */
async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${getApiUrl()}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Debug logging
  console.log('🌶️ API Request:', {
    url,
    method: requestOptions.method || 'GET',
    headers: requestOptions.headers,
    body: requestOptions.body
  });

  const response = await fetch(url, requestOptions);

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error('❌ Failed to parse response as JSON:', error);
    throw new ApiError(response.status, 'Invalid response from server');
  }

  console.log('🌶️ API Response:', {
    status: response.status,
    ok: response.ok,
    data
  });

  if (!response.ok) {
    throw new ApiError(
      response.status, 
      data.message || data.error || `API request failed: ${response.status}`
    );
  }

  return data;
}

/**
 * Sign up user with email
 */
export async function signupRequest(email: string): Promise<any> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new ApiError(400, 'Please provide a valid email address');
  }

  return apiRequest('/user/signup/request', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<any> {
  return apiRequest('/user/signup/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Verify signup token
 */
export async function verifySignupToken(token: string): Promise<any> {
  if (!token || token.trim() === '') {
    throw new ApiError(400, 'Verification token is required');
  }

  return apiRequest(`/user/signup/verify?token=${encodeURIComponent(token.trim())}`, {
    method: 'GET',
    credentials: 'include', // Include cookies if any
  });
}

/**
 * Complete account setup
 */
export async function completeAccountSetup(data: AccountSetupData): Promise<any> {
  // Validate required fields
  const requiredFields = ['first_name', 'last_name', 'address_line1', 'city', 'state', 'country', 'pin', 'country_code', 'contact_number', 'password'];
  const missingFields = requiredFields.filter(field => !data[field as keyof AccountSetupData] || data[field as keyof AccountSetupData].toString().trim() === '');
  
  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
  }
  
  if (!/^\d{10}$/.test(data.contact_number)) {
    throw new ApiError(400, 'Contact number must be exactly 10 digits');
  }
  
  if (!/^\d{5}(\d{4})?$/.test(data.pin)) {
    throw new ApiError(400, 'ZIP code must be 5 or 9 digits');
  }

  console.log('🌶️ Account setup payload validation passed:', {
    fields_count: Object.keys(data).length,
    contact_number_length: data.contact_number.length,
    pin_length: data.pin.length
  });

  return apiRequest('/user/signup/account-setup', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include', // Include cookies
  });
}

/**
 * Submit user preferences
 */
export async function submitUserPreferences(data: UserPreferencesData): Promise<any> {
  // Validate required fields
  const requiredFields = ['job_title', 'commitment', 'location', 'goal_choice'];
  const missingFields = requiredFields.filter(field => !data[field as keyof UserPreferencesData] || data[field as keyof UserPreferencesData].toString().trim() === '');
  
  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
  }

  // Ensure at least one job type is selected
  if (!data.part_time && !data.full_time && !data.internship && !data.contract) {
    throw new ApiError(400, 'At least one job type must be selected');
  }

  console.log('🌶️ User preferences payload validation passed:', {
    fields_count: Object.keys(data).length,
    job_types_selected: [data.part_time, data.full_time, data.internship, data.contract].filter(Boolean).length
  });

  return apiRequest('/user/signup/user-pref', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include', // Include cookies
  });
}

export { ApiError, getApiUrl, type AccountSetupData, type UserPreferencesData };