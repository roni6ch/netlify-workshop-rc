type Headers = { [key: string]: string };
type Body = Record<string, any>;

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const accountSegment = url.searchParams.get("accountSegment") || 'COMMERCIAL';
  const accountType = url.searchParams.get("accountType") || 'TRAVEL';
  const userName = url.searchParams.get("userName") || 'TEST';
  const withAddress = url.searchParams.get("withAddress");
  let TAtoken: string = '', loginToken: string = '', companyDomain: string = '', companyUuid: string = '';

  async function makeRequest(url: string, method: string, headers: Headers, body?: Body) {
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  }

  function getCommonHeaders(authToken: string, additionalHeaders = {}) {
    return {
      'Authorization': `TripActions ${authToken}`,
      'Content-Type': 'application/json',
      "Connection": "keep-alive",
      'accept': "*/*",
      ...additionalHeaders
    };
  }

  async function loginWithAuthToken() {
    const url = 'https://staging-prime.navan.com/api/uaa/token?isSA=true';
    const username = 'svc-qa-jenkins@tripactions.com';
    const password = process.env.SA_P;
    const headers = {
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    };
    const data = await makeRequest(url, 'POST', headers);
    TAtoken = data.token;
  }

  async function createCompany() {
    const randomId = Math.random().toString(36).substring(2, 8);
    companyDomain = `${accountSegment.toLowerCase()}${randomId}.xyz`;
    const email = `${userName}-traditional-${randomId}@${companyDomain}`;
    const familyName = 'TEST';
    const userUuid = "2b5651af-a8b5-4389-b80e-191266858a5c";
    const body = {
      category: 'COMMERCIAL',
      ae: userUuid,
      globalCsm: userUuid,
      launchManager: userUuid,
      accountSegment,
      accountType,
      companyName: randomId,
      companyDomain,
      admin: {
        email,
        familyName,
        givenName: userName,
      },
      isLHGCustomer: false,
      lhgPriceModel: 'free',
      onboardingCompanySource: 'TRAVEL_AND_PAYMENTS',
      ...(withAddress && {
        address: {
          address1: '123 Main St',
          address2: 'Suite 100',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
          zipCode: '94105'
        }
      })
    };

    const url = 'https://staging-prime.navan.com/api/superAdmin/selfonboarding/v2/company';
    const data = await makeRequest(url, 'POST', getCommonHeaders(TAtoken), body);
    companyUuid = data.company.uuid;
  }

  async function launchCompany() {
    const body = {
      companyUuid,
      billableEntityCountryCode: 'US',
      liquidCurrencyCode: 'USD',
      tripFee: '25',
      liquidApprovedLimit: '1',
      inviteToSelfOnboarding: 'YES',
      associateAgency: false,
      isComtravoOnboarding: false,
      admin: {
        email: `${userName}@${companyDomain}`,
        givenName: userName,
        familyName: 'TEST',
      },
    };
    const url = 'https://staging-prime.navan.com/api/superAdmin/selfonboarding/v2/confirm';
    await makeRequest(url, 'PUT', getCommonHeaders(TAtoken), body);
  }

  async function setupUser() {
    const email = `${userName}@${companyDomain}`;
    console.log(companyUuid);
    console.log(email);
    const signUpTokenUrl = `https://staging-prime.navan.com/api/superAdmin/signupToken?email=${email}`;
    const signupToken = await makeRequest(signUpTokenUrl, 'GET', getCommonHeaders(TAtoken));
    console.log(signupToken);
  }

  try {
    await loginWithAuthToken();
    await createCompany();
    await launchCompany();
    await setupUser();

    return new Response(
      JSON.stringify({
        statusCode: 200,
        message: 'Account successfully created!',
        loginToken,
        companyDomain,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in account creation flow:', error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: 'Error processing the request',
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};
