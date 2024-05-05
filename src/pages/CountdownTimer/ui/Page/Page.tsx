import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { convertToTime } from "@/lib/utils";

type Timer = {
  minutes: number;
  seconds: number;
  id: number;
};

const CountdownTimer: React.FC = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [currentTimer, setCurrentTimer] = useState<string>("00:00");
  const [activeTimerId, setActiveTimerId] = useState<number | null>(null);
  const [countActivate, setCountActivate] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    if (
      timers.length > 0 &&
      (activeTimerId === null || timers[0].id === activeTimerId)
    ) {
      startNextTimer();
    } else if (timers.length === 0) {
      clearActiveTimer();
    }
  }, [timers, activeTimerId]);

  useEffect(() => {
    if (
      countActivate < 0
    ) {
      setCountActivate(0); // reset state of count activate
      // remove timer that already done and continue to next timer
      const remainingTimers = timers.filter((timer) => timer.id !== activeTimerId);
      setTimers(remainingTimers);
      if (remainingTimers.length > 0) {
        const nextTimer = remainingTimers[0];
        setActiveTimerId(nextTimer.id);
      }
    }
  }, [countActivate, activeTimerId]);

  const clearActiveTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setCurrentTimer("00:00");
    setActiveTimerId(null);
  };

  const startNextTimer = () => {
    if (timers.length === 0) return;
    if (countActivate > 1) return; // Prevents reset current/active countdown timer due to react state & closure issue
    clearActiveTimer(); // Clear any existing active timer
    const nextTimer = timers[0];
    setActiveTimerId(nextTimer.id);
    setCountActivate(prevState => prevState + 1);
    countdown(nextTimer.minutes * 60 + nextTimer.seconds, nextTimer.id);
  };

  const countdown = (seconds: number, id: number) => {
    const tick = () => {
      if (id !== activeTimerId) return; // Prevents old timeouts from running if the active timer has changed

      let min = Math.floor(seconds / 60);
      let sec = seconds % 60;
      setCurrentTimer(convertToTime(min, sec));

      if (seconds > 0) {
        const newTimeoutId = setTimeout(tick, 1000);
        setTimeoutId(newTimeoutId);
        seconds--;
      } else {
        setCountActivate(-1); // Trigger countdown to next timer after current already finished
      }
    };
    tick();
  };

  const handleAddTimer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const minutes = parseInt(formData.get("minutes") as string);
    const seconds = parseInt(formData.get("seconds") as string);
    const newTimer = {
      minutes,
      seconds,
      id: Date.now(),
    };
    setTimers((prev) => [...prev, newTimer]);
    event.currentTarget.reset();
  };

  return (
    <>
      <section>
        <div className="bg-base hero h-screen">
          <div className="hero-content w-screen flex-col lg:flex-row">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl">Countdown Timer</h1>
              <h1 className="mb-20 text-8xl">{currentTimer}</h1>
              <form onSubmit={handleAddTimer}>
                <Input
                  type="number"
                  name="minutes"
                  placeholder="Minutes"
                  required
                  min="0"
                />
                <Input
                  type="number"
                  name="seconds"
                  placeholder="Seconds"
                  required
                  min="0"
                  max="59"
                />
                <button
                  type="submit"
                  className="btn bg-orange-700 text-white hover:bg-orange-500"
                >
                  Add Timer
                </button>
              </form>
            </div>
            <div className="lg:ml-60">
              <h1 className="mb-2 mt-10">Your Timers</h1>
              <div className="divider" />
              {timers.length > 0 && (
                <ul>
                  {timers.map((timer) => (
                    <li
                      className={`card rounded-box mb-2 p-4 pb-2 pt-2 ${
                        timer.id === activeTimerId
                          ? "bg-amber-300"
                          : "bg-base-300"
                      }`}
                      key={timer.id}
                    >
                      {convertToTime(timer.minutes, timer.seconds)}{" "}
                      {timer.id === activeTimerId ? "⏳" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CountdownTimer;
