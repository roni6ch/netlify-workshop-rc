import { getCommonHeaders, makeRequest } from "./util";

enum SignUpReason {
  TRAVEL_SOLUTION = "TRAVEL_SOLUTION",
  TRAVEL_AND_EXPENSE_SOLUTION = "TRAVEL_AND_EXPENSE_SOLUTION",
  TEAM_OFFSITE = "TEAM_OFFSITE",
  BOOK_FOR_OTHERS = "BOOK_FOR_OTHERS",
  BOOK_TRIP = "BOOK_TRIP",
}
export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const signupReason = url.searchParams.get("signupReason") || '';
  const userName = url.searchParams.get("userName") || '';
  let TAtoken: string = '', userEmail: string = '', leadToken: string = '', userToken: string = '';

  if (!signupReason) {
    return new Response(
      JSON.stringify({
        statusCode: 400,
        message: "Missing 'signUpReason' parameter",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  async function loginWithAuthToken() {
    const url = '/api/uaa/token?isSA=true';
    const username = 'svc-qa-jenkins@tripactions.com';
    const password = process.env.SA_P;
    const headers = {
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    };
    const data = await makeRequest(url, 'POST', headers);
    TAtoken = data.token;
  }

  async function signup() {
    const random = Math.random().toString(36).substring(2, 8);
    userEmail = `${userName}-generator@ss${random}.com`;
    const body = {
      email: userEmail,
      accountType: 'TRAVEL'
    };
    const url = '/api/selfSell/lead/signup';
    await makeRequest(url, 'POST', getCommonHeaders(TAtoken), body);
  }

  async function getLeadToken() {
    const url = `/api/selfSell/automation/lead/email/${userEmail}`;
    const { selfSellToken } = await makeRequest(url, 'GET', getCommonHeaders(TAtoken));
    leadToken = selfSellToken;
  }

  async function onboard() {
    const url = `/api/selfSell/onboard?token=${leadToken}`;
    const body = {
      firstName: userName,
      lastName: 'TEST',
      leadPhoneNumber: '',
      password: 'Trip@123',
      origin: 'MARKETING_PAGE',
      accountType: signupReason === 'TRAVEL_AND_EXPENSE_SOLUTION' ? 'TRAVEL_AND_LIQUID' : 'TRAVEL',
      signupReason
    };
    const { token } = await makeRequest(url, 'POST', getCommonHeaders(TAtoken), body);
    userToken = token;
  }

  async function setAdminClaim() {
    const url = `/api/selfSell/company/onboard`;
    const headers = {
      ...getCommonHeaders(userToken),
      'X-tripactions-locale': 'en-US',
      'Referer': '/app/user2/welcome-to-navan'
    };
    const { token } = await makeRequest(url, 'POST', headers);
    userToken = token;
  }

  try {
    await loginWithAuthToken();
    await signup();
    await getLeadToken();
    await onboard();
    if ([SignUpReason.TRAVEL_SOLUTION, SignUpReason.TRAVEL_AND_EXPENSE_SOLUTION].includes(signupReason as SignUpReason)) {
      await setAdminClaim();
    }

    return new Response(
      JSON.stringify({
        statusCode: 200,
        message: `${signupReason} executed successfully!`,
        userToken,
        userEmail,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in action flow:', error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: 'Error processing the request',
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};
