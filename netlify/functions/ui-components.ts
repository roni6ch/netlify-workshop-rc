import { Handler } from '@netlify/functions';
import { makeRequest, getCommonHeaders } from './util';

export const handler: Handler = async (event) => {
    try {
        if (!event.queryStringParameters?.key) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Component key is required' })
            };
        }

        const { key } = event.queryStringParameters;
        const { state } = JSON.parse(event.body || '{}');
        const token = event.headers.authorization?.replace('TripActions ', '');

        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Authorization token is required' })
            };
        }

        const response = await makeRequest({
            url: `/api/ui/components/${key}`,
            method: 'PUT',
            headers: getCommonHeaders(token),
            body: { state }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    } catch (error) {
        console.error('Error in ui-components function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 