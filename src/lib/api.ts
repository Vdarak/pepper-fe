/**
 * API utility functions for the Pepper application
 */

interface ApiResponse<T = unknown> {
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
async function apiRequest<T = unknown>(
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
  console.log('🔍 API Request:', {
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

  console.log('✅ API Response:', {
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
export async function signupRequest(email: string): Promise<ApiResponse> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new ApiError(400, 'Please provide a valid email address');
  }

  return apiRequest<ApiResponse>('/user/signup/request', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

/**
 * Login user with email and password
 */
export async function loginRequest(email: string, password: string): Promise<{ message: string }> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new ApiError(400, 'Please provide a valid email address');
  }

  if (!password || password.trim() === '') {
    throw new ApiError(400, 'Password is required');
  }

  return apiRequest<{ message: string }>('/user/login', {
    method: 'POST',
    body: JSON.stringify({ 
      email: email.trim().toLowerCase(),
      password: password
    }),
    credentials: 'include', // Include cookies
  });
}

/**
 * Logout user
 */
export async function logoutRequest(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/user/logout', {
    method: 'POST',
    credentials: 'include', // Include cookies for logout
  });
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>('/user/signup/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Verify signup token
 */
export async function verifySignupToken(token: string): Promise<string> {
  if (!token || token.trim() === '') {
    throw new ApiError(400, 'Verification token is required');
  }

  const response = await apiRequest<string>(`/user/signup/verify?token=${encodeURIComponent(token.trim())}`, {
    method: 'GET',
    credentials: 'include', // Include cookies if any
  });
  
  // API returns just a success message string
  return response;
}

/**
 * Complete account setup
 */
export async function completeAccountSetup(data: AccountSetupData): Promise<ApiResponse> {
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

  console.log('✓ Account setup payload validation passed:', {
    fields_count: Object.keys(data).length,
    contact_number_length: data.contact_number.length,
    pin_length: data.pin.length
  });

  return apiRequest<ApiResponse>('/user/signup/account-setup', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include', // Include cookies
  });
}

/**
 * Submit user preferences
 */
export async function submitUserPreferences(data: UserPreferencesData): Promise<ApiResponse> {
  // Validate required fields
  const requiredFields = ['job_title', 'commitment', 'location', 'goal_choice'];
  const missingFields = requiredFields.filter(field => !data[field as keyof UserPreferencesData] || data[field as keyof UserPreferencesData].toString().trim() === '');
  
  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
  }

  console.log('✓ User preferences payload validation passed:', {
    fields_count: Object.keys(data).length,
    job_title: data.job_title,
    commitment: data.commitment,
    goal_choice: data.goal_choice
  });

  return apiRequest<ApiResponse>('/user/signup/user-pref', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include', // Include cookies
  });
}

interface ResumeUploadData {
  file: File;
  name: string;
  file_format: string;
}

interface ResumeUploadResponse {
  message: string;
  resume_id: string;
}

/**
 * Upload user resume
 */
export async function uploadResume(data: ResumeUploadData): Promise<ResumeUploadResponse> {
  // Validate required fields
  if (!data.file) {
    throw new ApiError(400, 'Resume file is required');
  }
  
  if (!data.name || !data.name.trim()) {
    throw new ApiError(400, 'Resume name is required');
  }
  
  if (!data.file_format || !data.file_format.trim()) {
    throw new ApiError(400, 'File format is required');
  }

  console.log('✓ Resume upload payload validation passed:', {
    name: data.name,
    file_format: data.file_format,
    file_size: data.file.size,
    file_name: data.file.name
  });

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('name', data.name.trim());
  formData.append('file_format', data.file_format.trim());

  const url = `${getApiUrl()}/resume/upload`;
  
  console.log('🔍 API Request:', {
    url,
    method: 'POST',
    name: data.name,
    file_format: data.file_format
  });

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include', // Include cookies
    // Note: Don't set Content-Type header - browser will set it with boundary for multipart/form-data
  });

  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    console.error('❌ Failed to parse response as JSON:', error);
    throw new ApiError(response.status, 'Invalid response from server');
  }

  console.log('✅ API Response:', {
    status: response.status,
    ok: response.ok,
    data: responseData
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      responseData.message || responseData.error || `Resume upload failed: ${response.status}`
    );
  }

  return responseData;
}

export { ApiError, getApiUrl, type AccountSetupData, type UserPreferencesData, type ResumeUploadData };