import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes = [
  index("routes/home.tsx"),
  route("/auth", "routes/auth.tsx"),
] satisfies RouteConfig;

export default routes;
