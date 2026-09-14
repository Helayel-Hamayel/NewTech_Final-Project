import { Link } from "react-router-dom";

export default function FieldGuardHeader() {
  return (
    <>
      <Link to="/field-guard">Home</Link>
      <Link to="/field-guard/report">View Reports</Link>
      <Link to="/field-guard/history">View History</Link>
    </>
  );
}
