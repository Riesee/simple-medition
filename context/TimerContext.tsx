import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface TimerContextType {
  duraiton: Number;
  setDuration: Dispatch<SetStateAction<Number>>;
}

export const TimerContext =
  createContext<TimerContextType>
    ({
      duraiton: 10,
      setDuration: () => { },
    })

interface TimerProviderProps {
  children: ReactNode;
}

const TimerProvider = ({ children }: TimerProviderProps) => {
  const [duration, setDuration] = useState(10);
  return (
    <TimerContext.Provider value={{ duration, setDuration }}>
      {children}
    </TimerContext.Provider>
  );
};


export default TimerProvider;