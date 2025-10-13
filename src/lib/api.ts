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
 * Check user authorization
 */
export async function checkAuthorization(): Promise<{ authorized: boolean; message?: string }> {
  try {
    const response = await fetch(`${getApiUrl()}/user/authorize`, {
      method: 'GET',
      credentials: 'include', // Include cookies
    });

    console.log('🔍 Authorization Check:', {
      status: response.status,
      ok: response.ok,
    });

    // If 200, user is authorized
    if (response.ok) {
      return { authorized: true };
    }

    // If 401, user is unauthorized
    if (response.status === 401) {
      let message = 'Unauthorized';
      try {
        const data = await response.json();
        message = data.message || message;
      } catch {
        // Response might not be JSON
      }
      return { authorized: false, message };
    }

    // Any other status code is treated as unauthorized
    return { authorized: false, message: 'Authorization check failed' };
  } catch (error) {
    console.error('❌ Authorization check error:', error);
    return { authorized: false, message: 'Network error during authorization check' };
  }
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

interface ResumeReUploadData {
  file: File;
  name: string;
  id_resume: string;
}

/**
 * Re-upload an existing resume
 */
export async function reUploadResume(data: ResumeReUploadData): Promise<ResumeUploadResponse> {
  // Validate required fields
  if (!data.file) {
    throw new ApiError(400, 'Resume file is required');
  }
  
  if (!data.name || !data.name.trim()) {
    throw new ApiError(400, 'Resume name is required');
  }
  
  if (!data.id_resume || !data.id_resume.trim()) {
    throw new ApiError(400, 'Resume ID is required');
  }

  console.log('✓ Resume re-upload payload validation passed:', {
    name: data.name,
    id_resume: data.id_resume,
    file_size: data.file.size,
    file_name: data.file.name
  });

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('name', data.name.trim());
  formData.append('id_resume', data.id_resume.trim());

  const url = `${getApiUrl()}/resume/re-upload`;
  
  console.log('🔍 API Request (Re-upload):', {
    url,
    method: 'POST',
    name: data.name,
    id_resume: data.id_resume
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

  console.log('✅ API Response (Re-upload):', {
    status: response.status,
    ok: response.ok,
    data: responseData
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      responseData.message || responseData.error || `Resume re-upload failed: ${response.status}`
    );
  }

  return responseData;
}

// ===== Resume Management APIs =====

interface Resume {
  Name: string;
  IsOriginal?: boolean;
  CreatedOn: string;
  UpdatedOn: string;
  IDResume: string;
  Analyzed: boolean;
  IsParsed: boolean;
}

interface ResumeListResponse {
  resumes: Resume[];
}

interface ResumeDeleteResponse {
  message: string;
  resume_id: string;
}

interface ResumeRenameResponse {
  message: string;
  resume_id: string;
}

// Resume info response type
export interface ResumeInfoResponse {
  resume_data: Array<{
    IDResumeSection: string;
    SectionTitle: string;
    Items: string; // JSON string that needs to be parsed
  }>;
}/**
 * List all resumes
 */
export async function listResumes(count: number = 15): Promise<ResumeListResponse> {
  return apiRequest<ResumeListResponse>('/resume/list', {
    method: 'POST',
    body: JSON.stringify({ count }),
    credentials: 'include',
  });
}

/**
 * Delete a resume
 */
export async function deleteResume(resumeId: string): Promise<ResumeDeleteResponse> {
  if (!resumeId || !resumeId.trim()) {
    throw new ApiError(400, 'Resume ID is required');
  }

  return apiRequest<ResumeDeleteResponse>('/resume/delete', {
    method: 'POST',
    body: JSON.stringify({ resume_id: resumeId.trim() }),
    credentials: 'include',
  });
}

/**
 * Rename a resume
 */
export async function renameResume(resumeId: string, newName: string): Promise<ResumeRenameResponse> {
  if (!resumeId || !resumeId.trim()) {
    throw new ApiError(400, 'Resume ID is required');
  }

  if (!newName || !newName.trim()) {
    throw new ApiError(400, 'New name is required');
  }

  return apiRequest<ResumeRenameResponse>('/resume/rename', {
    method: 'POST',
    body: JSON.stringify({ 
      resume_id: resumeId.trim(),
      new_name: newName.trim()
    }),
    credentials: 'include',
  });
}

/**
 * Download a resume
 */
export async function downloadResume(resumeId: string): Promise<Blob> {
  if (!resumeId || !resumeId.trim()) {
    throw new ApiError(400, 'Resume ID is required');
  }

  const url = `${getApiUrl()}/resume/download`;
  
  console.log('🔍 API Request (Download):', {
    url,
    method: 'POST',
    resume_id: resumeId
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resume_id: resumeId.trim() }),
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `Download failed: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use default error message
    }
    throw new ApiError(response.status, errorMessage);
  }

  console.log('✅ Download Response:', {
    status: response.status,
    contentType: response.headers.get('content-type'),
  });

  return response.blob();
}

/**
 * Fetch resume info for editor
 */
export async function fetchResumeInfo(resumeId: string): Promise<ResumeInfoResponse> {
  if (!resumeId || !resumeId.trim()) {
    throw new ApiError(400, 'Resume ID is required');
  }

  return apiRequest<ResumeInfoResponse>('/resume/edit/fetch', {
    method: 'POST',
    body: JSON.stringify({ IDResume: resumeId.trim() }),
    credentials: 'include',
  });
}

/**
 * Job-related types
 */
export interface Job {
  Title: string;
  ApplyURL: string;
  RequirementSummary: string;
  Description: string;
  TechTools: string | null;
  Commitment: string;
  Location: string;
  PublishedOn: string;
  VisaSponsorship: string | null;
  SeniorityLevel: string;
  CompensationFrequency: string;
  CompensationCurrency: string;
  PayYearlyMax: string;
  PayYearlyMin: string;
  PayHourlyMax: string | null;
  PayHourlyMin: string | null;
  WorkPlaceType: string;
  JobSector: string;
  ApiVersion: string;
  res1: string | string[];
  RawPayload: string;
}

export interface Company {
  Name: string;
  Website: string | null;
  ImageUrl: string | null;
  LinkedIn: string | null;
  Tagline: string | null;
  YearFounded: number | null;
  HQCountry: string;
  Industries: string | null;
  NumEmployees: number | null;
  IsPublic: boolean;
  IsNonProfit: boolean;
}

export interface JobListing {
  Job: Job;
  Company: Company;
}

export interface FetchJobsResponse {
  jobs: JobListing[];
}

/**
 * Fetch jobs from the API
 */
export async function fetchJobs(size: number = 30): Promise<JobListing[]> {
  return apiRequest<JobListing[]>('/jobs/fetch_jobs', {
    method: 'POST',
    body: JSON.stringify({ size }),
    credentials: 'include',
  });
}

// Resume info response type
export interface ResumeInfoResponse {
  resume_data: Array<{
    IDResumeSection: string;
    SectionTitle: string;
    Items: string; // JSON string that needs to be parsed
  }>;
}

export { 
  ApiError, 
  getApiUrl, 
  type AccountSetupData, 
  type UserPreferencesData, 
  type ResumeUploadData,
  type ResumeReUploadData,
  type Resume,
  type ResumeListResponse,
  type ResumeDeleteResponse,
  type ResumeRenameResponse
};