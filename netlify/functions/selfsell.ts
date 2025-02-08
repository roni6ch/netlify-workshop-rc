import { getCommonHeaders, loginWithAuthToken, makeRequest } from "./util";

enum SignUpReasonMapper {
  TRAVEL_SOLUTION = "T",
  TRAVEL_AND_EXPENSE_SOLUTION = "TE",
  TEAM_OFFSITE = "GROUP",
  BOOK_FOR_OTHERS = "DELEGATE",
  BOOK_TRIP = "ROUGH",
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

  async function signup() {
    console.log('-- signup --');
    const random = Math.random().toString(36).substring(2, 8);
    const signupResonMapper = SignUpReasonMapper[signupReason as keyof typeof SignUpReasonMapper];
    userEmail = `${userName}-generator@ss${random}-${signupResonMapper}.com`;
    console.log(userEmail);
    const body = {
      email: userEmail,
      accountType: 'TRAVEL'
    };
    const url = '/api/selfSell/lead/signup';
    await makeRequest({ url, method: 'POST', headers: getCommonHeaders(TAtoken), body });
  }

  async function getLeadToken() {
    console.log('-- getLeadToken --');
    const url = `/api/selfSell/automation/lead/email/${userEmail}`;
    const { selfSellToken } = await makeRequest({ url, method: 'GET', headers: getCommonHeaders(TAtoken) });
    leadToken = selfSellToken;
  }

  async function onboard() {
    console.log('-- onboard --');
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
    const data = await makeRequest({ url, method: 'POST', headers: getCommonHeaders(TAtoken), body });
    userToken = data.token;
  }

  try {
    TAtoken = await loginWithAuthToken();
    await signup();
    await getLeadToken();
    await onboard();

    return new Response(
      JSON.stringify({
        statusCode: 200,
        message: `${signupReason} executed successfully!`,
        userToken,
        email: userEmail,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error('Error in action flow:', error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: error?.message || 'Internal server error',
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};
