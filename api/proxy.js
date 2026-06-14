export default async function handler(request, response) {
  const apiPath = request.query.path;
  //CORS headers FIRST 
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "*");

  //OPTIONS preflight
  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (!apiPath) return response.status(400).json({ error: "Missing path" });

  try {
    const url = `https://worldcup26.ir/${apiPath}`;
    const res = await fetch(url);

    if (!res.ok) {
      return response.status(500).json({ error: "Error al obtener los datos" });
    }

    const data = await res.json();
    response.status(200).json(data);
  } catch (error) {
    response.status(502).json({ error: "Upstream unreachable" });
  }
}
