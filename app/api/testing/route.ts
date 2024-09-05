import {
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
} from "@solana/actions";


export const GET = async (req: Request) => {
    const requestUrl = new URL(req.url);
    console.log(requestUrl);
    try{
        console.log("something");
        const link = analyzeLink(req);
        console.log(link);  
        return Response.json(link, {headers: ACTIONS_CORS_HEADERS,})
    } catch (err) {
        console.log(err);
        let message = "An unknown error occurred";
        if (typeof err == "string") message = err;
        return new Response(message, {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
    }
}

function analyzeLink(req: Request) {
    // Get the current query parameters
    const requestUrl = new URL(req.url);
    const params = new URLSearchParams(window.location.search);
    
    // Extract individual parameters
    const programId = params.get('programId');
    const selectedChain = params.get('selectedChain');
    const selectedToken = params.get('selectedToken');
    const amount = params.get('amount');
    
    // Return an object with the extracted data
    return { programId, selectedChain, selectedToken, amount };
  }