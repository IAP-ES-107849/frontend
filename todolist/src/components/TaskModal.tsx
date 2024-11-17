import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";

type NewTask = {
  title: string;
  description: string;
  priority: number;
  deadline: Date | null;
  status: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  deadline: Date | null;
  created_at: string;
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task | NewTask) => void;
  initialTask: Task | NewTask;
  onDelete?: (id: string) => void;
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  onDelete
}: TaskModalProps) {
  const [task, setTask] = useState(() => {
    if ('id' in initialTask) {
      return initialTask;
    } else {
      return {
        title: '',
        description: '',
        status: 'Todo',
        priority: 1,
        deadline: null,
      };
    }
  });

  useEffect(() => {
    if (isOpen) {
      setTask('id' in initialTask ? initialTask : {
        title: '',
        description: '',
        status: 'Todo',
        priority: 1,
        deadline: null,
      });
    }
  }, [isOpen, initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
    onClose();
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return "text-green-500";
      case 2: return "text-yellow-500";
      case 3: return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Todo': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'In Progress': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Done': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {('id' in initialTask) ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="w-full min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select
                value={task.status}
                onValueChange={(value) => setTask({ ...task, status: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todo">
                    <div className="flex items-center">
                      {getStatusIcon('Todo')}
                      <span className="ml-2">Todo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="In Progress">
                    <div className="flex items-center">
                      {getStatusIcon('In Progress')}
                      <span className="ml-2">In Progress</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Done">
                    <div className="flex items-center">
                      {getStatusIcon('Done')}
                      <span className="ml-2">Done</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
              <Select
                value={task.priority.toString()}
                onValueChange={(value) => setTask({ ...task, priority: parseInt(value) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <span className={cn("font-medium", getPriorityColor(1))}>Low</span>
                  </SelectItem>
                  <SelectItem value="2">
                    <span className={cn("font-medium", getPriorityColor(2))}>Medium</span>
                  </SelectItem>
                  <SelectItem value="3">
                    <span className={cn("font-medium", getPriorityColor(3))}>High</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-sm font-medium">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !task.deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {task.deadline ? format(task.deadline, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={task.deadline || undefined}
                  onSelect={(date) => setTask({ ...task, deadline: date || null })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter className="sm:justify-between">
            {'id' in task && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
              >
                Delete
              </Button>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {'id' in initialTask ? 'Update Task' : 'Add Task'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}