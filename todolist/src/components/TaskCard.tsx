import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar, Clock } from 'lucide-react'

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  deadline: Date | null;
  created_at: string;
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const priorityColors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-800'
  }

  const priorityLabels = ['Low', 'Medium', 'High']

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = task.deadline && new Date(task.deadline) < new Date()

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
            {priorityLabels[task.priority - 1]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Deadline: {formatDate(task.deadline)}</span>
          {isOverdue && (
            <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
              Overdue
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>Created: {formatDate(new Date(task.created_at))}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="destructive"
          size="sm"
          className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-500 hover:to-red-700"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}