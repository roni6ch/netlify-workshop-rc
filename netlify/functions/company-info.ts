import { getCommonHeaders, loginWithAuthToken, makeRequest } from "./util";

export default async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const companyUuid = url.searchParams.get("companyUuid") || '';
    let TAtoken: string = '';

    async function getCompanyInfo() {
        const url = `/api/superAdmin/selfonboarding/v2/params?companyUuid=${companyUuid}`;
        const data = await makeRequest({ url, method: 'GET', headers: getCommonHeaders(TAtoken), body: null });
        return data;
    }

    try {
        TAtoken = await loginWithAuthToken();
        const data = await getCompanyInfo();
        return new Response(
            JSON.stringify({
                statusCode: 200,
                message: `${companyUuid} executed successfully!`,
                data,
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