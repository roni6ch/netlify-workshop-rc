export const ENV = 'https://staging-prime.navan.com';

type Headers = { [key: string]: string };

type Request = { url: string, method: string, headers: Headers, body?: any, isTextResponse?: boolean, isProd?: boolean }

function generateCurlCommand({ url, method, headers = {}, body }) {
  const headerStrings = Object.entries(headers).map(
    ([key, value]) => `-H "${key}: ${value}"`
  ).join(' ');

  // if body is a string, don't escape it
  // if there is no body, don't include -d
  const safeBody = typeof body === 'string' ? body : JSON.stringify(body);

  const curl = `curl -X ${method} ${headerStrings} ${safeBody ? `-d '${safeBody}'` : ''} "${ENV + url}"`;

  console.log('📦 Generated cURL request:\n', curl);

  return curl;
}

export async function makeRequest({
  url,
  method,
  headers,
  body,
  isTextResponse,
}: Request) {
  try {
    const safeBody = typeof body === 'string' ? body : JSON.stringify(body);
    if (url === '/api/superAdmin/selfonboarding/v2/company') {
      console.log(generateCurlCommand({ url, method, headers, body: safeBody }));
    }
    const response = await fetch(ENV + url, {
      method,
      headers,
      ...(body ? { body: safeBody } : {}),
    });
    console.log('response', response);
    console.log('response.ok', response.ok);
    console.log('response.status', response.status);
    console.log('response.statusText', response.statusText);
    console.log('response.headers', response.headers);

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
