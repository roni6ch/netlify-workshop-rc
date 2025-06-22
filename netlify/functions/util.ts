export const ENV = 'https://staging-prime.navan.com';

type Headers = { [key: string]: string };

type Request = { url: string, method: string, headers: Headers, body?: any, isTextResponse?: boolean, isProd?: boolean }

export async function makeRequest({
  url,
  method,
  headers,
  body,
  isTextResponse,
}: Request) {
  try {
    // make curl console.log
    const curlCommand = `curl -X ${method} -H "${Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join(' -H "')}" -d '${JSON.stringify(body)}' ${ENV + url}`;
    console.log('curlCommand', curlCommand);
    console.log('JSON.stringify(body) ', JSON.stringify(body) );
    const response = await fetch(ENV + url, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    console.log('after fetch', response);

    if (!response.ok) {
      const text = await response.text();
      console.error(`Request failed: ${response.status}`, text);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (isTextResponse) {
      return response.text();
    }
    const res = await response.json();
    console.log('res', res);
    return res;
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
