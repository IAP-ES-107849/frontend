import config from "@/config";
import { createClient } from "./client";

const client = createClient(config.API_USER_URL);

const UserService = {
  async login(code: string) {
    return client.post("/api/sign-in?code=" + code);
  },
  async logout() {
    return client.get("/api/logout");
  },
  async getUser() {
    return client.get("/api/me");
  },
};

export { UserService };