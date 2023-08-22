import { Outlet } from "react-router-dom";
import Navigacija from "./Navigacija/Navigacija";

export default function MainLayout() {
  return (
    <>
    <Navigacija></Navigacija>
    <Outlet></Outlet>
    </>
  );
}