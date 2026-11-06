export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    const apiUrl = new URL(
        "https://api.openweathermap.org/data/2.5/weather"
    );

    apiUrl.searchParams.set("q", city);
    apiUrl.searchParams.set("appid", process.env.OPENWEATHER_API_KEY);

    const response = await fetch(apiUrl);
    const data = await response.json();

    return Response.json(data, {
        status: response.status
    });
}