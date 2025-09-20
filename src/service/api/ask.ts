// src\service\api\ask.ts
export interface ApiResponse {
  answer: string;
}

/**
 * Sends a user's question to the backend API for processing by Bedrock
 * @param question The user's natural language question
 * @returns The response from the Bedrock model via your Lambda function
 */
export const askQuestion = async (question: string): Promise<ApiResponse> => {
  // 1. Read the base URL from the environment variable
  const API_BASE_URL = "https://kr6yyu1wff.execute-api.ap-southeast-1.amazonaws.com/prod";

  // 2. Check if it's configured, throw a clear error if not
  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured. Please check your .env file.');
  }

  // 3. Construct the full endpoint URL
  const API_URL = `${API_BASE_URL}/medihub-query-handler`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling the MedHub API:', error);
    // Provide a more specific error message for network issues
    if (error instanceof TypeError && error.message == 'Failed to fetch') {
      throw new Error('Network error: Cannot connect to the server. Please check if the backend is running and the URL is correct.');
    }
    throw error; // Re-throw the original error if it's a different type
  }
};