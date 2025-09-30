import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes = [
  index("routes/home.tsx"),
  route("/auth", "routes/auth.tsx"),
  route("/upload", "routes/upload.tsx"),
  route("/resume/:id", "routes/resume.tsx"),

] satisfies RouteConfig;

export default routes;
