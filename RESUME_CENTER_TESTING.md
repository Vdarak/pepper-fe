# Resume Center Testing Guide

## Prerequisites
1. Backend API server running at configured URL (default: `http://localhost:8000/api`)
2. User logged in and on the dashboard page
3. Valid authentication cookies present

## Test Cases

### 1. Initial Load
- [ ] Navigate to dashboard after login
- [ ] Verify Resume Center component is visible
- [ ] Verify "Fetch Resumes" button is present
- [ ] Verify Upload section is visible

### 2. Fetch Resumes
**Steps:**
1. Click "Fetch Resumes" button
2. Verify loading state shows "Loading..."
3. Wait for API response

**Expected Results:**
- If resumes exist: Cards display with all resume information
- If no resumes: Shows message "No resumes found..."
- Check console for API logs: `🔍 API Request` and `✅ API Response`

### 3. Upload Resume
**Steps:**
1. Click file input and select a PDF/DOC file
2. Verify filename auto-populates the name field
3. Optionally edit the name
4. Click "Upload" button

**Expected Results:**
- Button shows "Uploading..." during upload
- Success alert appears with message
- Resume list automatically refreshes
- New resume appears in the list

**Error Cases:**
- Try uploading without selecting file → Alert: "Please select a file and provide a name"
- Try uploading without name → Same alert
- Invalid file type (if backend validates) → Error alert from API

### 4. Rename Resume
**Steps:**
1. Ensure at least one resume exists
2. Click the edit icon (pencil) on a resume card
3. Verify inline input appears with current name
4. Edit the name
5. Click check mark (✓) to save

**Expected Results:**
- Name field becomes editable
- Save and cancel buttons appear
- Success alert after saving
- Card updates with new name
- Edit mode exits

**Error Cases:**
- Empty name → Alert: "Name cannot be empty"
- Click X to cancel → Returns to display mode without saving

### 5. Download Resume
**Steps:**
1. Ensure at least one resume exists
2. Click the download icon on a resume card

**Expected Results:**
- File download starts automatically
- Filename matches resume name with extension
- Check browser downloads folder for file
- Check console for download logs

**Error Cases:**
- Invalid resume ID → Error alert from API
- Network error → Error alert

### 6. Delete Resume
**Steps:**
1. Ensure at least one resume exists
2. Click the trash icon on a resume card
3. Confirm deletion in dialog

**Expected Results:**
- Confirmation dialog appears with resume name
- After confirming: Success alert appears
- Resume card disappears from list
- If cancel: No changes made

**Error Cases:**
- Network error → Error alert
- Resume not found → Error alert from API

### 7. Resume Status Display
**Verify each resume card shows:**
- [ ] Resume name (bold, large)
- [ ] Created date (formatted)
- [ ] Updated date (formatted)
- [ ] Upload status badge (green if uploaded)
- [ ] Analysis status badge (blue if analyzed, yellow if not)

### 8. Multiple Resumes
**Steps:**
1. Upload or fetch multiple resumes
2. Verify vertical scrolling works
3. Test all actions on different resumes

**Expected Results:**
- Cards stack vertically
- Scrollbar appears if > 600px height
- Each resume has independent action buttons
- Can edit/delete/download any resume

### 9. UI States
**Loading States:**
- [ ] Fetch button shows spinner and "Loading..." text
- [ ] Upload button shows spinner and "Uploading..." text
- [ ] Logout button shows spinner and "Logging out..." text

**Disabled States:**
- [ ] Upload button disabled when no file or no name
- [ ] Fetch button disabled during loading

**Empty State:**
- [ ] Shows message when no resumes exist
- [ ] Message guides user to upload or fetch

### 10. Error Handling
**Network Errors:**
1. Stop backend server
2. Try each operation
3. Verify friendly error alerts appear

**Invalid Data:**
1. Try operations with invalid data
2. Verify validation errors show

### 11. Responsive Design
**Test at different screen sizes:**
- [ ] Desktop (>1024px): Upload section on one row
- [ ] Tablet (768-1024px): Layout adapts
- [ ] Mobile (<768px): Upload section stacks vertically

### 12. Console Logs
**Verify proper logging:**
- [ ] API requests show with payload
- [ ] API responses show with status
- [ ] Errors log with details

## API Endpoint Tests

### Manual API Testing (using curl or Postman)

```bash
# 1. List Resumes
curl -X POST http://localhost:8000/api/resume/list \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{"count": 0}'

# 2. Upload Resume
curl -X POST http://localhost:8000/api/resume/upload \
  -b "cookies.txt" \
  -F "file=@/path/to/resume.pdf" \
  -F "name=My Resume" \
  -F "file_format=pdf"

# 3. Rename Resume
curl -X POST http://localhost:8000/api/resume/rename \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{"resume_id": "abc123", "new_name": "Updated Resume Name"}'

# 4. Download Resume
curl -X POST http://localhost:8000/api/resume/download \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{"resume_id": "abc123"}' \
  -o downloaded_resume.pdf

# 5. Delete Resume
curl -X POST http://localhost:8000/api/resume/delete \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{"resume_id": "abc123"}'
```

## Browser Console Commands

```javascript
// Test list resumes
const { listResumes } = await import('/src/lib/api.ts');
const resumes = await listResumes(0);
console.log(resumes);

// Test upload (need file object)
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const { uploadResume } = await import('/src/lib/api.ts');
await uploadResume({ file, name: 'Test', file_format: 'pdf' });

// Test rename
const { renameResume } = await import('/src/lib/api.ts');
await renameResume('resume_id_here', 'New Name');

// Test delete
const { deleteResume } = await import('/src/lib/api.ts');
await deleteResume('resume_id_here');
```

## Common Issues & Solutions

### Issue: "No resumes found" after fetch
**Solutions:**
- Check if resumes exist in backend
- Verify API endpoint is correct
- Check authentication cookies
- Review backend logs

### Issue: Upload fails
**Solutions:**
- Check file format (PDF, DOC, DOCX)
- Verify file size limits
- Check network tab for error details
- Verify backend is running

### Issue: Download doesn't work
**Solutions:**
- Check browser popup blocker
- Verify file exists on backend
- Check browser console for errors
- Verify content-type header

### Issue: Authentication errors
**Solutions:**
- Verify user is logged in
- Check cookies in browser DevTools
- Re-login if session expired
- Verify API URL in localStorage

## Performance Testing

- [ ] Upload large files (test limits)
- [ ] Fetch large number of resumes (test scrolling)
- [ ] Rapid clicking buttons (test loading states)
- [ ] Concurrent operations (test race conditions)

## Accessibility Testing

- [ ] Tab through all interactive elements
- [ ] Test with keyboard only (Enter to submit)
- [ ] Test with screen reader (if available)
- [ ] Verify button labels are descriptive

## Cross-Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS)

## Test Checklist Summary

Before considering feature complete:
- [ ] All 12 test cases pass
- [ ] All API endpoints work
- [ ] Error handling works properly
- [ ] UI is responsive
- [ ] Loading states work
- [ ] No console errors
- [ ] Documentation is accurate
