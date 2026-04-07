import { Timer, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const REST_OPTIONS = [
  { label: "30s", seconds: 30 },
  { label: "60s", seconds: 60 },
  { label: "90s", seconds: 90 },
  { label: "2min", seconds: 120 },
];

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RestTimerProps {
  visible: boolean;
}

export function RestTimer({ visible }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalRef = useRef(0);

  const start = (seconds: number) => {
    clearInterval(intervalRef.current ?? undefined);
    totalRef.current = seconds;
    setTimeLeft(seconds);
    setRunning(true);
  };

  const stop = () => {
    clearInterval(intervalRef.current ?? undefined);
    setRunning(false);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current ?? undefined);
          setRunning(false);
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current ?? undefined);
  }, [running]);

  const progress =
    running && totalRef.current > 0 ? timeLeft / totalRef.current : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${sec}s`;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="rest-timer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed bottom-24 left-0 right-0 flex justify-center z-30 pointer-events-none"
          data-ocid="day_detail.rest_timer"
        >
          <div className="pointer-events-auto mx-4 max-w-[440px] w-full">
            <div className="bg-card/95 backdrop-blur-md border border-border/60 rounded-2xl shadow-lg px-4 py-3">
              {running ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <svg
                        width="56"
                        height="56"
                        className="-rotate-90"
                        role="img"
                        aria-label="Poilsio laikmatis"
                      >
                        <circle
                          cx="28"
                          cy="28"
                          r={RADIUS}
                          fill="none"
                          stroke="oklch(var(--border))"
                          strokeWidth="4"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r={RADIUS}
                          fill="none"
                          stroke="oklch(var(--primary))"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={CIRCUMFERENCE}
                          strokeDashoffset={strokeDashoffset}
                          style={{
                            transition: "stroke-dashoffset 0.9s linear",
                          }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-display font-black text-sm text-foreground">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Poilsio laikmatis
                      </p>
                      <p className="font-display font-bold text-foreground text-sm">
                        Ilsėkis...
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={stop}
                    data-ocid="day_detail.rest_timer.close_button"
                    className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Poilsis
                    </span>
                  </div>
                  <div className="flex gap-2 flex-1 justify-end">
                    {REST_OPTIONS.map((opt) => (
                      <button
                        key={opt.seconds}
                        type="button"
                        onClick={() => start(opt.seconds)}
                        data-ocid="day_detail.rest_timer.toggle"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-muted hover:bg-primary hover:text-primary-foreground text-foreground transition-colors border border-border/40"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
