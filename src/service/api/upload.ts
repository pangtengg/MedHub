// src/service/api/upload.ts
  interface UploadRequest {
    fileName: string;
    fileType: string;
    fileSize: number;
    type: 'patient' | 'general';
    patientId?: string;
    patientName?: string;
    department?: string;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  fileKey: string;
  bucketName: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Gets a presigned URL for uploading a file to S3
 * @param fileName The name of the file to upload
 * @param fileType The MIME type of the file
 * @param fileSize The size of the file in bytes
 * @returns The presigned URL and file key
 */
export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  fileSize: number,
  docType: 'patient' | 'general',
  patientInfo?: { id: string; name: string; department?: string }
): Promise<PresignedUrlResponse> => {
  const API_BASE_URL = "https://kr6yyu1wff.execute-api.ap-southeast-1.amazonaws.com/prod";
  const API_URL = `${API_BASE_URL}/get-presigned-url`;

const requestBody: UploadRequest = {
    fileName,
    fileType,
    fileSize,
    type: docType,
  };

  if (docType === "patient" && patientInfo) {
    requestBody.patientId = patientInfo.id;
    requestBody.patientName = patientInfo.name;
    requestBody.department = patientInfo.department;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

/**
 * Uploads a file to S3 using a presigned URL
 * @param file The file to upload
 * @param presignedUrl The presigned URL for upload
 * @param onProgress Optional callback for upload progress
 * @returns Promise that resolves when upload is complete
 */
export const uploadFileToS3 = async (
  file: File,
  presignedUrl: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<void> => {
  console.log('🚀 Starting S3 upload:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    presignedUrl: presignedUrl.substring(0, 100) + '...'
  });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        console.log('📊 Upload progress:', progress.percentage + '%');
        onProgress(progress);
      }
    });

    // Handle upload completion
    xhr.addEventListener('load', () => {
      console.log('✅ Upload completed with status:', xhr.status);
      console.log('📥 Response headers:', xhr.getAllResponseHeaders());
      
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('🎉 Upload successful!');
        resolve();
      } else {
        console.error('❌ Upload failed with status:', xhr.status);
        console.error('❌ Response text:', xhr.responseText);
        reject(new Error(`Upload failed with status: ${xhr.status} - ${xhr.responseText}`));
      }
    });

    // Handle upload errors
    xhr.addEventListener('error', (event) => {
      console.error('❌ Upload network error:', event);
      reject(new Error('Upload failed due to network error'));
    });

    // Handle upload abortion
    xhr.addEventListener('abort', () => {
      console.warn('⚠️ Upload was aborted');
      reject(new Error('Upload was aborted'));
    });

    // Handle timeout
    xhr.addEventListener('timeout', () => {
      console.error('⏰ Upload timeout');
      reject(new Error('Upload timeout'));
    });

    try {
      // Start the upload
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      
      // Set a reasonable timeout (5 minutes)
      xhr.timeout = 5 * 60 * 1000;
      
      console.log('📤 Sending file to S3...');
      xhr.send(file);
    } catch (error) {
      console.error('❌ Error starting upload:', error);
      reject(error);
    }
  });
};

/**
 * Complete file upload process: get presigned URL and upload file
 * @param file The file to upload
 * @param onProgress Optional callback for upload progress
 * @returns Promise that resolves with the file key when upload is complete
 */
export const uploadFile = async (
  file: File,
  docType: 'patient' | 'general',
  patientInfo?: { id: string; name: string; department?: string },
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
    if (!file) throw new Error('File is required');
    if (file.size > 10 * 1024 * 1024) throw new Error('File size exceeds 10MB limit');
    if (!file.name.toLowerCase().endsWith('.pdf')) throw new Error('Only PDF files are allowed');
  // Get presigned URL with metadata
  const { presignedUrl, fileKey } = await getPresignedUrl(
    file.name,
    file.type,
    file.size,
    docType,
    patientInfo
  );

  await uploadFileToS3(file, presignedUrl, onProgress);
  return fileKey;
};
