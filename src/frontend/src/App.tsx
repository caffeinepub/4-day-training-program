import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Dumbbell, History, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DayDetail } from "./components/DayDetail";
import { HistoryView } from "./components/HistoryView";
import { ProgramView } from "./components/ProgramView";
import { WeightJournal } from "./components/WeightJournal";
import { useGetProgram, useGetWorkoutLogs } from "./hooks/useQueries";
import type { WorkoutDay } from "./types";

const queryClient = new QueryClient();

type Tab = "program" | "history" | "weights";

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("program");
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);

  const { data: days = [], isLoading: daysLoading } = useGetProgram();
  const { data: logs = [], isLoading: logsLoading } = useGetWorkoutLogs();

  const handleDaySelect = (day: WorkoutDay) => {
    setSelectedDay(day);
  };

  const handleBack = () => {
    setSelectedDay(null);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[480px] relative">
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key="day-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
              >
                <DayDetail day={selectedDay} onBack={handleBack} />
              </motion.div>
            ) : activeTab === "program" ? (
              <motion.div
                key="program"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="pt-16">
                  <ProgramView
                    days={days}
                    logs={logs}
                    isLoading={daysLoading}
                    onDaySelect={handleDaySelect}
                  />
                </div>
              </motion.div>
            ) : activeTab === "history" ? (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="pt-16">
                  <HistoryView
                    logs={logs}
                    days={days}
                    isLoading={logsLoading}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="weights"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="pt-16">
                  <WeightJournal />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {!selectedDay && (
          <nav className="fixed top-0 left-0 right-0 z-20 flex justify-center">
            <div className="w-full max-w-[480px] bg-background/90 backdrop-blur-sm border-b border-border/30 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-sm text-foreground">
                  TrainPro
                </span>
              </div>
              <div className="flex bg-card rounded-xl p-1 border border-border/40">
                <button
                  type="button"
                  data-ocid="nav.program_tab"
                  onClick={() => setActiveTab("program")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "program"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  Programa
                </button>
                <button
                  type="button"
                  data-ocid="nav.history_tab"
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "history"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  Istorija
                </button>
                <button
                  type="button"
                  data-ocid="nav.weights_tab"
                  onClick={() => setActiveTab("weights")}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "weights"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Svoriai
                </button>
              </div>
            </div>
          </nav>
        )}

        {!selectedDay && (
          <footer className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none">
            <div className="w-full max-w-[480px] pb-4 pt-2 flex justify-center">
              <p className="text-xs text-muted-foreground/50 pointer-events-auto">
                © {new Date().getFullYear()}. Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-muted-foreground transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
