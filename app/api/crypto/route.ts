import {NextResponse} from 'next/server'

export async function GET(req: Request) {
    console.log(req.url)
    const { search } = new URL(req.url)

    const baseEndpoint = "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
    const endpoint = `${baseEndpoint}${search}`

    // TODO: Move to .env file
    const apiKey = "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c"
    const headers = { 
        'Content-Type': 'application/json',
        'X-CMC_PRO_API_KEY': apiKey
    }

    const data = await basicFetch(endpoint, headers)

    return NextResponse.json(data)
}

const basicFetch = async <ReturnType>(endpoint: string, headers: any): Promise<ReturnType> => {
    const response = await fetch(endpoint, {headers: headers})

    // TODO: Seems like this is the best place to troubleshoot the random errors
    if (!response.ok) {
        response.text().then(text => { throw new Error(text) })
    }

    const data = await response.json();

    return data
}