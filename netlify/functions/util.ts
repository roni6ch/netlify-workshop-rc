export const ENV = 'https://staging-prime.navan.com';

type Headers = { [key: string]: string };
type Body = Record<string, any>;

type Request = { url: string, method: string, headers: Headers, body?: Body | null, isTextResponse?: boolean, isProd?: boolean }

export async function makeRequest({
  url,
  method,
  headers,
  body,
  isTextResponse,
  isProd
}: Request) {
  try {
    const response = await fetch(ENV + url, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

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
    ...(authToken ? { 'Authorization': `TripActions ${authToken}` } : {}),
    'Content-Type': 'application/json',
    "Connection": "keep-alive",
    'accept': "*/*",
    ...additionalHeaders
  };
}

export async function loginWithAuthToken() {
  const url = '/api/uaa/token?isSA=true';
  const username = 'svc-qa-jenkins@tripactions.com';
  const password = process.env.SA_P;
  const headers = {
    'Authorization': 'Basic ' + btoa(username + ':' + password),
    'Content-Type': 'application/json'
  };
  const data = await makeRequest({ url, method: 'POST', headers });
  return data.token;
}
