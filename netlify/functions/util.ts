export const ENV = 'https://staging-prime.navan.com';

type Headers = { [key: string]: string };
type Body = Record<string, any>;

export async function makeRequest(url: string, method: string, headers: Headers, body?: Body | null, isTextResponse?: boolean) {
    try {
      const response = await fetch(ENV + url, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      console.log(response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (isTextResponse) {
        return response.text();
      } 
      return await response.json();
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  }


  export function getCommonHeaders(authToken?: string, additionalHeaders = {}) {
    return {
      ...(authToken ? { 'Authorization': `TripActions ${authToken}` } : {} ),
      'Content-Type': 'application/json',
      "Connection": "keep-alive",
      'accept': "*/*",
       ...additionalHeaders
    };
  }