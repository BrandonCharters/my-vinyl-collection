import Search from "./components/Search";
import Collection from "./components/Collection";
import axios from "axios";
import { useEffect } from "react";

export default function App() {

  return (
    <div className="max-w-6xl mx-auto">
      <Search />
      <hr className="my-8 border-gray-300" />
      <Collection />
    </div>
  );
}
