import { useLocation, matchPath } from "react-router-dom";

// Hook to check if the current route matches the given path
// Usage: const isMatch = useRouteMatch('/some-path');
export default function useRouteMatch(path) {
  const location = useLocation();
  return matchPath(location.pathname, { path });
}