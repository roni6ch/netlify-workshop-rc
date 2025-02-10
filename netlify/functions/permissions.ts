import { getCommonHeaders, loginWithAuthToken, makeRequest } from "./util";

export default async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get("userEmail") || '';
    let TAtoken: string = '';

    async function checkPermissions() {
        const url = `/api/splits/GROWTH_DEBUG_VIEW?userEmail=${userEmail}`;
        const data = await makeRequest({ url, method: 'GET', headers: getCommonHeaders() });
        return data;
    }

    try {
        TAtoken = await loginWithAuthToken();
        const data = await checkPermissions();
        return new Response(
            JSON.stringify({
                statusCode: 200,
                message: `executed successfully!`,
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