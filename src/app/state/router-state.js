import { signal } from "@preact/signals";
import { ROUTE_NAMES } from "../services/router-service.js";

export const currentRoute = signal({
  name: ROUTE_NAMES.HOME,
  params: {},
});

export function setCurrentRoute(route) {
  currentRoute.value = route;
}
