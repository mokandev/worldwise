import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import AppNav from "../components/AppNav";

export default function Homepage() {
  return (
    <div>
      <PageNav />
      Worldwise
      <AppNav />

      <Link to="/app">App</Link>
    </div>
  )
}
