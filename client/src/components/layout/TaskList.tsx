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
        const peakStreak = task.peakStreak || task.streak // Use peak streak or current streak as fallback

        return (
          <Card
            key={task.id}
            className={`p-4 transition-all duration-200 ${task.completed ? "bg-muted/50 border-primary/20" : "hover:shadow-md"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex flex-col items-center space-y-1">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onToggleTask(task.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1 h-5 w-5 border-2 hover:border-primary/60 transition-colors"
                  />
                  {/* <span className="text-xs text-muted-foreground font-medium">{task.completed ? "Done" : "Mark"}</span> */}
                </div>

                <div className="flex-1 space-y-2">
                  <h3
                    className={`font-medium text-base transition-all duration-200 ${task.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                  >
                    {task.title}
                  </h3>

                  {task.completed && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-xs text-primary font-medium">Completed today!</span>
                    </div>
                  )}

                  {isOverdue && !task.completed && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-xs text-destructive font-medium">Streak at risk!</span>
                    </div>
                  )}

                  {task.lastCompleted && !task.completed && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Last completed:{" "}
                        {task.lastCompleted === today
                          ? "Today"
                          : task.lastCompleted === yesterday
                            ? "Yesterday"
                            : new Date(task.lastCompleted).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex flex-col space-y-1">
                  <Badge className={`${getStreakColor(streakStatus)} flex items-center gap-1`}>
                    <Flame className="h-3 w-3" />
                    <span className="font-medium">
                      {task.streak} day{task.streak !== 1 ? "s" : ""}
                    </span>
                  </Badge>
                </div>
                <div className="flex flex-col space-y-1">
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <Trophy className="h-3 w-3 text-amber-500" />
                    <span>Best: {peakStreak}</span>
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
