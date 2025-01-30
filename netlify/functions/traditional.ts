type Headers = { [key: string]: string };
type Body = Record<string, any>;

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const accountSegment = url.searchParams.get("accountSegment") || 'COMMERCIAL';
  const accountType = url.searchParams.get("accountType") || 'TRAVEL';
  const givenName = url.searchParams.get("userName") || 'TEST';
  const withAddress = url.searchParams.get("withAddress");
  const familyName = 'TEST';
  let TAtoken: string = '', loginToken: string = '', companyDomain: string = '', companyUuid: string = '', email: string = '';

  async function makeRequest(url: string, method: string, headers: Headers, body?: Body | null, isTextResponse?: boolean) {
    try {
      const response = await fetch(url, {
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

  function getCommonHeaders(authToken?: string, additionalHeaders = {}) {
    return {
      ...(authToken ? { 'Authorization': `TripActions ${authToken}` } : {} ),
      'Content-Type': 'application/json',
      "Connection": "keep-alive",
      'accept': "*/*",
       ...additionalHeaders
    };
  }

  async function loginWithAuthToken() {
    console.log('--- loginWithAuthToken ---');
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
    console.log('--- createCompany ---');
    const randomId = Math.random().toString(36).substring(2, 8);
    const companyName = `${accountSegment.toLowerCase()}${randomId}`;
    companyDomain = `${companyName}.xyz`;
    email = `${givenName}-generator-traditional-${randomId}@${companyDomain}`;
    const userUuid = "2b5651af-a8b5-4389-b80e-191266858a5c";
    const body = {
      category: 'COMMERCIAL',
      ae: userUuid,
      globalCsm: userUuid,
      launchManager: userUuid,
      accountSegment,
      accountType,
      companyName,
      companyDomain,
      admin: {
        email,
        familyName,
        givenName,
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
    console.log('--- launchCompany ---');
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
        email,
        givenName,
        familyName,
      },
    };
    const url = 'https://staging-prime.navan.com/api/superAdmin/selfonboarding/v2/confirm';
    await makeRequest(url, 'PUT', getCommonHeaders(TAtoken), body);
  }

  async function setupUser() {
    console.log('--- setupUser ---');
    const signUpTokenUrl = `https://staging-prime.navan.com/api/superAdmin/signupToken?email=${email}`;
    loginToken = await makeRequest(signUpTokenUrl, 'GET', getCommonHeaders(TAtoken), null, true);
  }

  async function createAccount() {
    console.log('--- createAccount ---');
    const body = {
      emailVerificationToken: loginToken,
      email,
      password: 'Trip@123',
      passenger: {
        birthdate: '1920-01-01',
        familyName,
        givenName
      },
      familyName,
      givenName
    }
    console.log('companyUuid', companyUuid);
    console.log('email', email);
    const signUpTokenUrl = `https://staging-prime.navan.com/api/signup`;
    const x = await makeRequest(signUpTokenUrl, 'POST', getCommonHeaders(), body, true);
    console.log(x);
  }

  try {
    await loginWithAuthToken();
    await createCompany();
    await launchCompany();
    await setupUser();
    await createAccount();

    return new Response(
      JSON.stringify({
        statusCode: 200,
        message: 'Account successfully created!',
        loginToken,
        email,
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
