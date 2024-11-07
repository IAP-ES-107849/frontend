import config from "@/config";
import { createClient } from "./client";
import { TaskUpdate } from "@/lib/types";

const client = createClient(config.BASE_URL);

const TaskService = {
    async getTasks() {
        return client.get("/tasks");
    },
    async createTask(
        title: string,
        description: string,
        priority: number,
        deadline: string,
        user_id: string
    ) {
        return client.post("/tasks",
            { title, description, priority, deadline, user_id }
        );
    },
    async updateTask(id: string, task: TaskUpdate) {
        return client.put(`/tasks/${id}`, task);
    },
    async deleteTask(id: string) {
        return client.delete(`/tasks/${id}`);
    },
};

export { TaskService };