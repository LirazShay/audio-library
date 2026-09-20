const ROUTE_NAMES = Object.freeze({
  HOME: "home",
  TOPIC: "topic",
  TRACK: "track",
  NOT_FOUND: "not-found",
});

function notFoundRoute() {
  return {
    name: ROUTE_NAMES.NOT_FOUND,
    params: {},
  };
}

function decodeRouteId(value) {
  if (!value) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(value);
    return decoded.trim() === "" ? null : decoded;
  } catch {
    return null;
  }
}

export function parseRoute(hash) {
  if (hash === "" || hash === "#" || hash === "#/") {
    return {
      name: ROUTE_NAMES.HOME,
      params: {},
    };
  }

  if (typeof hash !== "string" || !hash.startsWith("#/")) {
    return notFoundRoute();
  }

  const path = hash.slice(2);
  const segments = path.split("/");

  if (segments.length !== 2) {
    return notFoundRoute();
  }

  const [routeName, rawId] = segments;
  const id = decodeRouteId(rawId);

  if (!id) {
    return notFoundRoute();
  }

  if (routeName === ROUTE_NAMES.TOPIC) {
    return {
      name: ROUTE_NAMES.TOPIC,
      params: { id },
    };
  }

  if (routeName === ROUTE_NAMES.TRACK) {
    return {
      name: ROUTE_NAMES.TRACK,
      params: { id },
    };
  }

  return notFoundRoute();
}

export function buildRoute(name, params = {}) {
  if (name === ROUTE_NAMES.HOME) {
    return "#/";
  }

  if (name === ROUTE_NAMES.TOPIC || name === ROUTE_NAMES.TRACK) {
    const id = typeof params.id === "string" ? params.id.trim() : "";

    if (!id) {
      throw new Error(`Route "${name}" requires a non-empty id.`);
    }

    return `#/${name}/${encodeURIComponent(id)}`;
  }

  throw new Error(`Unsupported route name: ${String(name)}.`);
}

export { ROUTE_NAMES };
