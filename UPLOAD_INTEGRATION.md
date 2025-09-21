# S3 Upload Integration

This document explains how the S3 upload functionality has been integrated into the MediHub application.

## Overview

The upload functionality allows users to upload medical documents directly to an S3 bucket using presigned URLs. This provides a secure and efficient way to handle file uploads without exposing AWS credentials to the client.

## API Endpoints

### Get Presigned URL
- **Endpoint**: `https://kr6yyu1wff.execute-api.ap-southeast-1.amazonaws.com/prod/get-presigned-url`
- **Method**: POST
- **Body**: 
  ```json
  {
    "fileName": "document.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000
  }
  ```
- **Response**:
  ```json
  {
    "presignedUrl": "https://s3.amazonaws.com/bucket/file-key?signature=...",
    "fileKey": "uploads/2024/01/document.pdf",
    "bucketName": "your-bucket-name"
  }
  ```

## Implementation

### Files Created/Modified

1. **`src/service/api/upload.ts`** - New upload service
2. **`src/components/query/DoctorQueryHub.tsx`** - Updated with S3 upload integration

### Key Features

- **Progress Tracking**: Real-time upload progress with percentage and visual progress bar
- **Error Handling**: Comprehensive error handling for network issues, file validation, and upload failures
- **File Validation**: File size limits (100MB) and type validation
- **Status Updates**: Document status updates (processing → processed/error)
- **S3 Key Storage**: Stores S3 file keys for future reference

### Usage Example

```typescript
import { uploadFile } from '../service/api/upload';

// Upload a file with progress tracking
const fileKey = await uploadFile(file, (progress) => {
  console.log(`Upload progress: ${progress.percentage}%`);
  // Update UI with progress
});
```

### UI Components

- **Progress Bar**: Visual progress indicator during upload
- **Status Badges**: Processing, processed, or error status
- **File Information**: File name, size, upload date, and page count
- **Error States**: Clear error messaging for failed uploads

## Security

- Uses presigned URLs for secure uploads
- No AWS credentials exposed to client
- File size and type validation
- Proper error handling and user feedback

## Error Handling

The system handles various error scenarios:
- Network connectivity issues
- Invalid file types or sizes
- S3 upload failures
- API endpoint errors

All errors are logged and displayed to the user with appropriate messaging.

## Future Enhancements

- File type restrictions (PDF, DOCX, etc.)
- Batch upload functionality
- Upload resume capability
- File preview before upload
- Integration with document processing pipeline
