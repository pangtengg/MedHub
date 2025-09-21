// src/service/api/upload.ts

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
  fileSize: number
): Promise<PresignedUrlResponse> => {
  const API_BASE_URL = "https://kr6yyu1wff.execute-api.ap-southeast-1.amazonaws.com/prod";
  const API_URL = `${API_BASE_URL}/get-presigned-url`;

  console.log('🔗 Getting presigned URL for:', {
    fileName,
    fileType,
    fileSize,
    apiUrl: API_URL
  });

  try {
    const requestBody = {
      fileName,
      fileType,
      fileSize,
    };

    console.log('📤 Sending request to API:', requestBody);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 API Response status:', response.status);
    console.log('📥 API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
    }

    const data: PresignedUrlResponse = await response.json();
    console.log('✅ Presigned URL received:', {
      presignedUrl: data.presignedUrl ? 'Present' : 'Missing',
      fileKey: data.fileKey,
      bucketName: data.bucketName
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error getting presigned URL:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Cannot connect to the server. Please check your connection.');
    }
    throw error;
  }
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
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  console.log('📁 Starting file upload process for:', file.name);
  
  try {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file provided');
    }

    console.log('✅ File validation passed:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Check file size (optional: limit to 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit');
    }

    // In the uploadFile function, add better validation
    if (!file || file.size === 0) {
      throw new Error('Invalid file provided');
    }

    if (!file.name || file.name.trim() === '') {
      throw new Error('File name is required');
    }

    // Check if file.name is a valid string
    if (typeof file.name !== 'string') {
      throw new Error('File name must be a string');
    }

    console.log('🔗 Getting presigned URL...');
    // Get presigned URL
    const { presignedUrl, fileKey } = await getPresignedUrl(
      file.name,
      file.type,
      file.size
    );

    console.log('🚀 Starting S3 upload...');
    // Upload file to S3
    await uploadFileToS3(file, presignedUrl, onProgress);

    console.log('🎉 File upload completed successfully!', { fileKey });
    return fileKey;
  } catch (error) {
    console.error('❌ Error in upload process:', error);
    throw error;
  }
};
