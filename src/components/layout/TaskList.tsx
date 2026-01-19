import { Card } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Flame, Trash2, AlertTriangle, Trophy, Calendar } from "lucide-react"


interface Task {
  id: string
  title: string
  completed: boolean
  streak: number
  peakStreak?: number 
  lastCompleted: string | null
  createdAt: string
}

interface TaskListProps {
  tasks: Task[]
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  const getStreakStatus = (task: Task) => {
    if (task.streak === 0) return "none"
    if (task.lastCompleted === today) return "active"
    if (task.lastCompleted === yesterday) return "at-risk"
    return "broken"
  }

  const getStreakColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary text-primary-foreground"
      case "at-risk":
        return "bg-secondary text-secondary-foreground"
      case "broken":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const streakStatus = getStreakStatus(task)
        const isOverdue = !task.completed && task.lastCompleted !== today
        const peakStreak = task.peakStreak || task.streak
        const isLockedIn = task.completed && task.lastCompleted === today

        return (
          <Card
            key={task.id}
            className={`p-3 sm:p-4 transition-all duration-200 ${task.completed ? "bg-muted/50 border-primary/20" : "hover:shadow-md"}`}
          >
            <div className="space-y-3">
              {/* Checkbox and Title Row */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onToggleTask(task.id)}
                    disabled={isLockedIn}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5 border-2 hover:border-primary/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium text-sm sm:text-base transition-all duration-200 break-words ${task.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                  >
                    {task.title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Messages */}
              <div className="pl-8 space-y-1">
                {task.completed && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-primary font-medium">Completed today!</span>
                  </div>
                )}

                {isOverdue && !task.completed && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0" />
                    <span className="text-xs text-destructive font-medium">Streak at risk!</span>
                  </div>
                )}

                {task.lastCompleted && !task.completed && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span>
                      Last:{" "}
                      {task.lastCompleted === today
                        ? "Today"
                        : task.lastCompleted === yesterday
                          ? "Yesterday"
                          : new Date(task.lastCompleted).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Badges Row */}
              <div className="flex items-center gap-2">
                <Badge className={`${getStreakColor(streakStatus)} text-xs flex items-center gap-1 whitespace-nowrap`}>
                  <Flame className="h-3 w-3" />
                  <span className="font-medium hidden sm:inline">
                    {task.streak} day{task.streak !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium sm:hidden">
                    {task.streak}
                  </span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-xs whitespace-nowrap">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  <span className="hidden sm:inline">Best: {peakStreak}</span>
                  <span className="sm:hidden">{peakStreak}</span>
                </Badge>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
