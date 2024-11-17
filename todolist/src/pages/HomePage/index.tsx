'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from "@/components/ui/button"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskService } from '@/services/Client/TaskService'
import { toast } from "@/hooks/use-toast"
import { useUserStore } from '@/stores/useUserStore'
import { TaskInDb } from '@/lib/types'
import { UserService } from '@/services/Client/UserService'
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  deadline: Date | null;
  created_at: string;
};

type NewTask = {
  title: string;
  description: string;
  priority: number;
  deadline: Date | null;
  status: string; // Added status field
};

export default function TodoList() {
  const queryClient = useQueryClient();
  const { token, setUserInformation } = useUserStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    priority: 0,
    deadline: null,
    status: "Todo" // Added initial status
  });

  const handleOpenAddTaskModal = () => {
    setNewTask({
      title: "",
      description: "",
      priority: 0,
      deadline: null,
      status: "Todo",
    }); // Reset the fields
    setIsAddTaskModalOpen(true);
  };

  const [sortBy, setSortBy] = useState<"deadline" | "createdAt">("deadline");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { data: tasks = [], refetch: refetchTasks } = useQuery<TaskInDb[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await TaskService.getTasks();
      console.log(response.data);
      return response.data;
    },
    enabled: !!token,
  });

  const fetchUser = async () => {
    const response = await UserService.getUser();
    return response.data;
  };

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token,
  });

  useEffect(() => {
    if (userData) {
      setUserInformation(userData);
    }
  }, [userData, setUserInformation]);


  const addTask = async (task: NewTask) => {
    console.log(task)
    try {
      await TaskService.createTask(
        task.title,
        task.description,
        task.priority,
        task.deadline ? new Date(task.deadline).toISOString() : '',
        task.status, // Added status to createTask
        userData.id,
      )
      refetchTasks()
      setIsAddTaskModalOpen(false)
      toast({
        title: "Success",
        description: "Task added successfully.",
      })
    } catch (error) {
      console.error('Failed to add task:', error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateTask = async (task: Task) => {
    try {
      await TaskService.updateTask(
        task.id,
        task.title,
        task.description,
        task.status,
        task.priority,
        task.deadline ? new Date(task.deadline).toISOString() : '',
        task.created_at,
        token
      )
      refetchTasks()
      setSelectedTask(null)
      toast({
        title: "Success",
        description: "Task updated successfully.",
      })
    } catch (error) {
      console.error('Failed to update task:', error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await TaskService.deleteTask(id)
      refetchTasks()
      toast({
        title: "Success",
        description: "Task deleted successfully.",
      })
    } catch (error) {
      console.error('Failed to delete task:', error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const updatedTask = tasks.find(task => task.id === result.draggableId)
    if (updatedTask) {
      updatedTask.status = result.destination.droppableId
      console.log(updatedTask)
      await updateTask(updatedTask)
    }
  }
  const handleTaskSubmit = async (task: Task | NewTask) => {
    if ('id' in task) {
      await updateTask(task);
    } else {
      await addTask(task);
    }
  };

  const sortedAndFilteredTasks = tasks
    .filter(task => priorityFilter === 'all' || task.priority === priorityFilter)
    .sort((a, b) => {
      const aDeadline = a.deadline ? new Date(a.deadline).getTime() : 0;
      const bDeadline = b.deadline ? new Date(b.deadline).getTime() : 0;

      if (sortBy === 'deadline') {
        return sortOrder === 'asc' ? aDeadline - bDeadline : bDeadline - aDeadline;
      } else {
        const aCreatedAt = new Date(a.created_at).getTime();
        const bCreatedAt = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? aCreatedAt - bCreatedAt : bCreatedAt - aCreatedAt;
      }
    });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex justify-between items-center mb-4">
      <Button onClick={handleOpenAddTaskModal}>Add Task</Button>
      <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: "deadline" | "createdAt") => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="createdAt">Created At</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="1">Low</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {(['Todo', 'In Progress', 'Done'] as const).map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                console.log(tasks),
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-4 rounded-lg"
                >
                  <h2 className="font-semibold mb-2">{status}</h2>
                  {sortedAndFilteredTasks
                    .filter(task => task.status === status)
                    .map((task, index) => (
                      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedTask(task)}
                          >
                            <TaskCard task={task} onDelete={deleteTask} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={(task) => addTask(task as NewTask)}
        initialTask={newTask}
      />

      {selectedTask && (
        <TaskModal
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          onSubmit={handleTaskSubmit}
          initialTask={selectedTask}
          onDelete={deleteTask} // Pass this as a prop

        />
      )}
    </div>
  )
}

