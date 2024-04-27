export default async (req: Request) => {
    console.log('SOME_SECOND_KEY', process.env.SOME_SECOND_KEY);
    console.log('TZ', process.env.TZ)
    return new Response(JSON.stringify({
      statusCode: 200,
      body: "hello world!"
    }));
  }