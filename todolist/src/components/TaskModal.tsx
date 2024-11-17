import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isBefore } from "date-fns";
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

  const [deadlineError, setDeadlineError] = useState<string | null>(null);

  // Inside the JSX
  {deadlineError && <p className="text-red-500 text-sm">{deadlineError}</p>}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            {('id' in initialTask) ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-600">
              Title
            </Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full border-gray-300 shadow-sm"
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-600">
              Description
            </Label>
            <Textarea
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="w-full border-gray-300 shadow-sm min-h-[100px]"
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-600">
                Status
              </Label>
              <Select
                value={task.status}
                onValueChange={(value) => setTask({ ...task, status: value })}
              >
                <SelectTrigger className="w-full border-gray-300 shadow-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {['Todo', 'In Progress', 'Done'].map((status) => (
                    <SelectItem value={status} key={status}>
                      <div className="flex items-center">
                        {getStatusIcon(status)}
                        <span className="ml-2">{status}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium text-gray-600">
                Priority
              </Label>
              <Select
                value={task.priority.toString()}
                onValueChange={(value) => setTask({ ...task, priority: parseInt(value) })}
              >
                <SelectTrigger className="w-full border-gray-300 shadow-sm">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3].map((priority) => (
                    <SelectItem value={priority.toString()} key={priority}>
                      <span className={cn("font-medium", getPriorityColor(priority))}>
                        {priority === 1 ? "Low" : priority === 2 ? "Medium" : "High"}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-sm font-medium text-gray-600">
              Deadline
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-300 shadow-sm",
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
                  onSelect={(date) => {
                    if (date && isBefore(date, new Date())) {
                      // Display an error message or handle the error
                      setDeadlineError("Deadline must be a future date.");
                    } else {
                      setDeadlineError(null);
                      setTask({ ...task, deadline: date || null });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-between items-center space-x-4">
            {'id' in task && onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="text-white bg-red-500 hover:bg-red-600"
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
              >
                Delete
              </Button>
            )}
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
                {('id' in initialTask) ? 'Update Task' : 'Add Task'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}