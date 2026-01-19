import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Calendar, Flame, Plus, Target, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button";

const setShowAddTask = (show: boolean) => {
  // This function would typically toggle a state variable to show or hide the add task dialog
  console.log("Toggle Add Task Dialog:", show);
}

function Home() {
  let completedToday = 0;
  let totalTasks = 0;
  let totalStreaks = 0;
  let bestPeakStreak = 0;
  let completionPercentage = 45;
  let todaysQuote = "Believe you can and you're halfway there.";



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
              {/* <TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} /> */}
              {/* {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Add your first daily task to start building streaks!</p>
              </div>
            )} */}
            </CardContent>
          </Card>

          {/* <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} onAddTask={addTask} /> */}
        </div>
      </div>
    </>
  )
}

export default Home;
