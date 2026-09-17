const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

const hitsByIp = new Map<string, number[]>();

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function allowRequest(ip: string) {
  const now = Date.now();
  const recent = (hitsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= MAX_REQUESTS) {
    hitsByIp.set(ip, recent);
    return false;
  }

  recent.push(now);
  hitsByIp.set(ip, recent);
  return true;
}
