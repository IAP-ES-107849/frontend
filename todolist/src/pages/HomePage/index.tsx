'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskService } from '@/services/Client/TaskService'
import { toast } from "@/hooks/use-toast"
import { useUserStore } from '@/stores/useUserStore'
import { TaskInDb } from '@/lib/types'

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
  // const queryClient = useQueryClient();
  const { token } = useUserStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTask] = useState<NewTask>({
    title: "",
    description: "",
    priority: 0,
    deadline: null,
    status: "Todo" // Added initial status
  });

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

  const addTask = async (task: NewTask) => {
    console.log(task)
    try {
      await TaskService.createTask(
        task.title,
        task.description,
        task.priority,
        task.deadline ? new Date(task.deadline).toISOString() : '',
        task.status, // Added status to createTask
        token
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
        <Button onClick={() => setIsAddTaskModalOpen(true)}>Add Task</Button>
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
          {(['todo', 'In Progress', 'Done'] as const).map((status) => (
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

function TaskCard({ task }: { task: Task; onDelete: (id: string) => void }) {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
        <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not set'}</p>
        <p>Priority: {['Low', 'Medium', 'High'][task.priority - 1]}</p>
        {/* <Button variant="destructive" onClick={() => onDelete(task.id)}>Delete</Button> */}
      </CardContent>
    </Card>
  )
}

function TaskModal({ isOpen, onClose, onSubmit, initialTask, onDelete }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Task | NewTask) => void
  initialTask: Task | NewTask
  onDelete?: (id: string) => void; // Added this line
}) {
  const [task, setTask] = useState(initialTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(task)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{('id' in initialTask) ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={('status' in task) ? task.status : 'Todo'}
              onValueChange={(value) => setTask({ ...task, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''}
              onChange={(e) => setTask({ ...task, deadline: new Date(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={task.priority.toString()}
              onValueChange={(value) => setTask({ ...task, priority: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Low</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">{'id' in initialTask ? 'Update Task' : 'Add Task'}</Button>
          {/* Only show the delete button if it's an existing task */}
          {'id' in task && onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id); // Call onDelete only if it exists
                onClose(); // Close the modal after deletion
              }}
            >
              Delete
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}