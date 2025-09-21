# S3 Upload Debugging Guide

## 🔍 Debugging Steps

### 1. **Check Browser Console**
Open your browser's Developer Tools (F12) and look for console logs with these emojis:
- 🔗 Getting presigned URL
- 📤 Sending request to API
- 📥 API Response status
- ✅ Presigned URL received
- 🚀 Starting S3 upload
- 📊 Upload progress
- ✅ Upload completed
- ❌ Any error messages

### 2. **Test API Endpoint Manually**
Test your presigned URL API endpoint directly:

```bash
curl -X POST https://kr6yyu1wff.execute-api.ap-southeast-1.amazonaws.com/prod/get-presigned-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024
  }'
```

Expected response:
```json
{
  "presignedUrl": "https://your-bucket.s3.amazonaws.com/path/to/file?signature=...",
  "fileKey": "uploads/2024/01/test.pdf",
  "bucketName": "your-bucket-name"
}
```

### 3. **Common Issues & Solutions**

#### **Issue 1: CORS Errors**
**Symptoms:** Console shows CORS errors
**Solution:** Ensure your S3 bucket and API Gateway have proper CORS configuration

#### **Issue 2: API Endpoint Not Responding**
**Symptoms:** Network error or 404/500 status
**Solutions:**
- Verify the API endpoint URL is correct
- Check if the Lambda function is deployed
- Verify API Gateway configuration

#### **Issue 3: Presigned URL Invalid**
**Symptoms:** 403 Forbidden when uploading to S3
**Solutions:**
- Check if the presigned URL is properly formatted
- Verify S3 bucket permissions
- Check if the URL has expired (usually 1 hour)

#### **Issue 4: File Upload Fails**
**Symptoms:** Upload starts but fails with error status
**Solutions:**
- Check file size limits
- Verify Content-Type header matches file type
- Check S3 bucket policy

### 4. **Use the Debug Component**

I've created a debug component at `src/components/debug/UploadTest.tsx`. To use it:

1. Import it in your main component:
```tsx
import { UploadTest } from './components/debug/UploadTest';
```

2. Add it to your JSX:
```tsx
<UploadTest />
```

This will give you a dedicated interface to test uploads with detailed logging.

### 5. **Check Network Tab**

In browser DevTools:
1. Go to Network tab
2. Try uploading a file
3. Look for:
   - POST request to `/get-presigned-url` (should return 200)
   - PUT request to S3 (should return 200 or 204)

### 6. **Verify S3 Bucket Configuration**

Make sure your S3 bucket has:
- Proper CORS configuration
- Correct bucket policy
- Public read access if needed

Example CORS configuration:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 7. **Test with Different File Types**

Try uploading different file types:
- Small text files (.txt)
- PDF files
- Images (.jpg, .png)
- Documents (.docx)

### 8. **Check File Size**

The current implementation has a 100MB limit. Try with:
- Very small files (< 1MB)
- Medium files (1-10MB)
- Large files (10-100MB)

## 🚨 Error Messages Reference

| Error Message | Possible Cause | Solution |
|---------------|----------------|----------|
| "Network error: Cannot connect to the server" | API endpoint unreachable | Check API URL and network |
| "API error (403): Forbidden" | API Gateway permissions | Check Lambda permissions |
| "API error (500): Internal Server Error" | Lambda function error | Check Lambda logs |
| "Upload failed with status: 403" | S3 permissions issue | Check S3 bucket policy |
| "Upload failed with status: 404" | Invalid presigned URL | Check presigned URL generation |
| "File size exceeds 100MB limit" | File too large | Reduce file size or increase limit |

## 📝 Debug Checklist

- [ ] API endpoint is accessible
- [ ] Presigned URL is generated successfully
- [ ] S3 bucket has proper CORS configuration
- [ ] File size is within limits
- [ ] Content-Type header is correct
- [ ] No CORS errors in console
- [ ] Network requests show proper status codes
- [ ] Upload progress is tracked correctly

## 🔧 Quick Fixes

1. **Clear browser cache and cookies**
2. **Try in incognito/private mode**
3. **Check if the file is actually being selected**
4. **Verify the upload button is being clicked**
5. **Check if the handleFiles function is being called**

## 📞 Next Steps

If you're still having issues after following this guide:

1. Share the console logs from your browser
2. Share the network requests from DevTools
3. Test the API endpoint manually with curl
4. Check your AWS CloudWatch logs for Lambda errors
5. Verify your S3 bucket configuration
