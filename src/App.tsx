import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Calendar, Flame, Plus, Target, Trophy } from "lucide-react";
import { AddTaskDialog } from "./components/layout/AddTaskDialog";
import { TaskList } from "./components/layout/TaskList";
import { CompleteTaskDialog } from "./components/layout/CompleteTaskDialog";
import { Progress } from "./components/ui/progress";
import { Button } from "./components/ui/button";
import { getAllTasks, replaceTasks, deleteTask as deleteTaskDb, type Task as DbTask } from "./lib/db";

const motivationalQuotes = [
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "You are never too old to set another goal or to dream a new dream.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
]

type Task = DbTask;

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(null)
  const [todaysQuote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
  const hasInitialized = useRef(false)

  // Load data from IndexedDB when app starts
  useEffect(() => {
    (async () => {
      try {
        const saved = await getAllTasks();
        setTasks(saved);
      } catch (err) {
        console.warn("IndexedDB read failed", err);
      }
      hasInitialized.current = true;
      setIsLoading(false);
    })();
  }, []);

  // Save everything to IndexedDB whenever tasks change (but only after first load)
  useEffect(() => {
    if (!hasInitialized.current || !tasks) return;
    (async () => {
      try {
        await replaceTasks(tasks);
      } catch (err) {
        console.warn("IndexedDB write failed", err);
      }
    })();
  }, [tasks]);

  // Clean up old tasks: reset streaks if they're older than yesterday, and clear completed flags from previous days
  useEffect(() => {
    if (isLoading) return;
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const nowIso = new Date().toISOString();

    setTasks((prev) =>
      prev.map((task) => {
        // Streak broken? Reset it if last completion was before yesterday
        if (task.lastCompleted && task.lastCompleted !== today && task.lastCompleted !== yesterday) {
          return { ...task, streak: 0, completed: false, lastCompleted: null, updatedAt: nowIso };
        }
        // Clear the "completed today" flag if it's from a previous day
        if (task.completed && task.lastCompleted !== today) {
          return { ...task, completed: false, updatedAt: nowIso };
        }
        return task;
      }),
    );
  }, [isLoading]);

  const addTask = (title: string) => {
    const nowIso = new Date().toISOString();
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      streak: 0,
      lastCompleted: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // When marking done, show confirmation popup (can't undo this)
    if (!task.completed) {
      setPendingCompleteId(taskId);
      return;
    }

    // Can uncheck anytime, just updates UI state
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: false, updatedAt: new Date().toISOString() } : t,
      ),
    );
  };

  const confirmCompleteTask = (taskId: string) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const nowIso = new Date().toISOString();

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        // Only bump streak once per day
        let newStreak = task.streak;
        if (task.lastCompleted !== today) {
          if (task.lastCompleted === yesterday) {
            newStreak = task.streak + 1;
          } else {
            newStreak = 1;
          }
        }

        const newPeakStreak = Math.max(task.peakStreak || 0, newStreak);
        return {
          ...task,
          completed: true,
          streak: newStreak,
          peakStreak: newPeakStreak,
          lastCompleted: today,
          updatedAt: nowIso,
        };
      }),
    );

    setPendingCompleteId(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    deleteTaskDb(taskId).catch((err) => console.warn("IndexedDB delete failed", err));
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

          {pendingCompleteId && (
            <CompleteTaskDialog
              open={!!pendingCompleteId}
              taskTitle={tasks.find((t) => t.id === pendingCompleteId)?.title || ""}
              onConfirm={() => confirmCompleteTask(pendingCompleteId)}
              onCancel={() => setPendingCompleteId(null)}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default App;