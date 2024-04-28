export default async (req: Request) => {
    return new Response(JSON.stringify({
      statusCode: 200,
      body: "hello world!"
    }));
  }