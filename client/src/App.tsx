import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Calendar, Flame, Plus, Target, Trophy } from "lucide-react"
import { AddTaskDialog } from "./components/layout/AddTaskDialog";
import { TaskList } from "./components/layout/TaskList";
import { Progress } from "./components/ui/progress";
import { Button } from "./components/ui/button";

const motivationalQuotes = [
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "You are never too old to set another goal or to dream a new dream.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
]

interface Task {
  id: string
  title: string
  completed: boolean
  streak: number
  peakStreak?: number // Added peak streak tracking
  lastCompleted: string | null
  createdAt: string
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [todaysQuote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("streakzilla-tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("streakzilla-tasks", JSON.stringify(tasks))
  }, [tasks])

  // Check for streak resets on app load
  useEffect(() => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    setTasks((prev) =>
      prev.map((task) => {
        if (task.lastCompleted && task.lastCompleted !== today && task.lastCompleted !== yesterday) {
          return { ...task, streak: 0 }
        }
        return task
      }),
    )
  }, [])

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      streak: 0,
      lastCompleted: null,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const toggleTask = (taskId: string) => {
    const today = new Date().toDateString()

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const wasCompleted = task.completed
          const newCompleted = !wasCompleted

          if (newCompleted && task.lastCompleted !== today) {
            const newStreak = task.streak + 1
            const newPeakStreak = Math.max(task.peakStreak || 0, newStreak)
            return {
              ...task,
              completed: true,
              streak: newStreak,
              peakStreak: newPeakStreak,
              lastCompleted: today,
            }
          } else if (!newCompleted && task.lastCompleted === today) {
            // Uncompleting task that was completed today
            return {
              ...task,
              completed: false,
              streak: Math.max(0, task.streak - 1),
              lastCompleted: task.streak > 1 ? today : null,
            }
          }
        }
        return task
      }),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const completedToday = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0
  const totalStreaks = tasks.reduce((sum, task) => sum + task.streak, 0)
  const bestPeakStreak = Math.max(...tasks.map((t) => t.peakStreak || 0), 0)



  return (
    <>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
              <Flame className="text-primary" />
              Streakzilla
            </h1>
            <p className="text-muted-foreground text-lg">{todaysQuote}</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {completedToday}/{totalTasks}
                </div>
                <Progress value={completionPercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">{completionPercentage.toFixed(0)}% complete</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Streaks</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalStreaks}</div>
                <p className="text-xs text-muted-foreground">Total streak days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{bestPeakStreak}</div>
                <p className="text-xs text-muted-foreground">Days in a row</p>
              </CardContent>
            </Card>
          </div>

          {/* Task Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daily Tasks
                </CardTitle>
                <Button onClick={() => setShowAddTask(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
              {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Add your first daily task to start building streaks!</p>
              </div>
            )}
            </CardContent>
          </Card>

          <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} onAddTask={addTask} />
        </div>
      </div>
    </>
  )
}

export default App;
