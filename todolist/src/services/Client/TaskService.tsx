import config from "@/config";
import { createClient } from "./client";

const client = createClient(config.BASE_URL);

const TaskService = {
    async getTasks() {
        return client.get("/api/tasks");
    },
    async createTask(
        title: string,
        description: string,
        priority: number,
        deadline: string,
        user_id: string
    ) {
        return client.post("/api/tasks",
            { title, description, priority, deadline, user_id }
        );
    },
    async updateTask(
        id: string,
        title: string,
        description: string,
        status: string,
        priority: number,
        deadline: string,
        created_at: string,
      ) {
        console.log("updateTask",priority);
        return client.put(`/api/tasks/${id}`, {
          title,
          description,
          status,
          priority,
          deadline,
          created_at,
        });
      },
    async deleteTask(id: string) {
        return client.delete(`/api/tasks/${id}`);
    },
};

export { TaskService };