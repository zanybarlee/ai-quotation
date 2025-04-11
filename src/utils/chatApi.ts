
/**
 * Utility for interacting with the external chat API
 */

import { UserRole } from "@/components/RoleSelector";

interface ChatQueryParams {
  question: string;
  overrideConfig: {
    sessionId: string;
    responseFormat?: "json" | "text";
  };
}

/**
 * Send a query to the chat API
 * @param message - The message to send
 * @param sessionId - The session ID (role or user ID)
 * @param responseFormat - Optional parameter to specify response format (json or text)
 * @returns The response from the API
 */
export async function query(message: string, sessionId: string, responseFormat: "json" | "text" = "text"): Promise<string> {
  const data: ChatQueryParams = {
    question: message,
    overrideConfig: {
      sessionId,
      responseFormat,
    },
  };

  try {
    const response = await fetch(
      "http://127.0.0.1:3001/api/v1/prediction/29a25199-6cd2-4396-902e-0cefd1b11155",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result.text || "";
  } catch (error) {
    console.error("Chat API error:", error);
    throw new Error("Failed to fetch data from the chat API");
  }
}
