import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CountdownTimer, NoMatch } from "@/pages";

const App: FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<CountdownTimer />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};

export default App;
