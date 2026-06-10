export interface Channel {
  id: string;
  name: string;
  color: string;
}

export const channels: Channel[] = [
  { id: "dsports", name: "DSports", color: "#009C3B" },
  { id: "tyc", name: "TyC Sports", color: "#002D72" },
  { id: "telefe", name: "Telefe", color: "#E2001A" },
  { id: "tvp", name: "TV Pública", color: "#00A4E4" },
  { id: "disney", name: "Disney+", color: "#0063E5" },
];

export function getChannelById(id: string): Channel | undefined {
  return channels.find((c) => c.id === id);
}
