import { getCommonHeaders, makeRequest } from "./util";

export default async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || '';

    async function getOG() {
        const url = `/api/selfSetup/onboardingGuides`;
        const data = await makeRequest({ url, method: 'GET', headers: getCommonHeaders(token) });
        return data;
    }

    try {
        const data = await getOG();
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