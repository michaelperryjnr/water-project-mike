import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Analytics from "./Pages/Dashboard/Analytics";
import RouteWithPreloader from "./Components/RouteWithPreloader";
import Employee from "./Pages/Employees/Employee";
import NextOfKin from "./Pages/NextOfKin/NextOfKin";
import Login from "./Pages/Authentication/Login";
import TestForm3 from "./Components/Forms/TestForm3";
import Positions from "./Pages/Positions/Positions";
import Departments from "./Pages/Departments/Departments";
import Vehicles from "./Pages/Vehicles/Vehicles";
import Insurance from "./Pages/Insurance/Insurance";
import RoadWorth from "./Pages/RoadWorth/RoadWorth";
/* import UpdateInsuranceForm2 from "./Components/Forms/UpdateForms/UpdateInsuranceForm"; */
/* import UpdateTestForm from "./Components/UpdateTestForm"; */

// Main App Component
function App() {
  return (
    <Router>
      <RouteWithPreloader>
        <Routes>
          {/* <Route exact path="/" element={<Preloader />} /> */}
          <Route exact path="/" element={<Login />} />
          <Route exact path="/analytics" element={<Analytics />} />
          <Route exact path="/employee" element={<Employee />} />
          <Route exact path="/nextofkin" element={<NextOfKin />} />
          <Route exact path="/department" element={<Departments />} />
          <Route exact path="/position" element={<Positions />} />
          <Route exact path="/vehicles" element={<Vehicles />} />
          <Route exact path="/insurance" element={<Insurance />} />
          <Route exact path="/roadworth" element={<RoadWorth />} />
          {/* <Route path="/insurance/edit/:id" element={<UpdateTestForm />} /> */} {/* This is for creating a standalone form */}
          <Route exact path="/test" element={<TestForm3 />} />
        </Routes>
      </RouteWithPreloader>
    </Router>
  );
}

export default App;
