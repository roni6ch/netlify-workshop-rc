import { getCommonHeaders, loginWithAuthToken, makeRequest } from "./util";

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const accountSegment = url.searchParams.get("accountSegment") || 'COMMERCIAL';
  const accountType = url.searchParams.get("accountType") || 'TRAVEL';
  const givenName = url.searchParams.get("userName") || 'TEST';
  const withAddress = url.searchParams.get("withAddress");
  const familyName = 'TEST';
  let TAtoken: string = '', loginToken: string = '', companyDomain: string = '', companyUuid: string = '', email: string = '';

  async function createCompany() {
    console.log('--- createCompany ---');
    const randomId = Math.random().toString(36).substring(2, 8);
    const companyName = `${accountSegment.toLowerCase()}${randomId}`;
    companyDomain = `${companyName}.staging-prime.tripactions.xyz`;
    email = `${givenName}-TRAD-${randomId}@${companyDomain}`;
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
    const url = '/api/superAdmin/selfonboarding/v2/company';
    const data = await makeRequest({ url, method: 'POST', headers: getCommonHeaders(TAtoken), body: JSON.stringify(body) });
    console.log('data', data);
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
    console.log('body', body);
    const url = '/api/superAdmin/selfonboarding/v2/confirm';
    await makeRequest({ url, method: 'PUT', headers: getCommonHeaders(TAtoken), body });
  }

  async function setupUser() {
    console.log('--- setupUser ---');
    const url = `/api/superAdmin/signupToken?email=${email}`;
    loginToken = await makeRequest({ url, method: 'GET', headers: getCommonHeaders(TAtoken), body: null, isTextResponse: true });
    console.log('loginToken ---> ', loginToken);
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
    const url = `/api/signup`;
    const signupResponse = await makeRequest({ url, method: 'POST', headers: getCommonHeaders(), body, isTextResponse: true });
    console.log(signupResponse);
  }

  try {
    TAtoken = await loginWithAuthToken();
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
  } catch (error: any) {
    console.error('Error in account creation flow:', error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: error?.message || 'Error processing the request',
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};
