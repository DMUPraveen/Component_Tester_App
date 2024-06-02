import { useState, useEffect, useRef } from "react";
import DrawChart from "./Utilities/Draw_Chart"
import Navbar from "./Components/Navbar";
import { ToolGrid_Component, ToolGrid_General } from "./Components/ToolGrid";
import { Outlet } from "react-router-dom";

function App() {

  return (
    <div className="flex flex-col flex-grow items-center ">
      <div className="font-black text-4xl">♛ Circuit King ♛</div>
      <div className="h-2/12"> </div>
      <div className="flex flex-row w-full flex-grow">
        <div className="basis-1/5"></div>
        <div className="basis-3/5 flex flex-col justify-around">
          <div className="text-center font-black text-2xl p-1">General Measurement</div>
          <ToolGrid_General />
          <div></div>
          <div className="text-center font-black text-2xl p-1">Component Testing</div>
          <ToolGrid_Component />
        </div>
        <div className="basis-1/5"></div>
      </div >
    </div>
  )
}


// function App() {
//   // const canvasRef = useRef(null);
//   // useEffect(() => { return DrawChart(canvasRef) });
//   // <canvas ref={canvasRef}></canvas>
//   return (
//     <div className="flex flex-col h-screen bg-white">
//       <Navbar />
//       <Outlet />
//     </div>
//   )

// }

export default App;
