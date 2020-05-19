import React, { useEffect, useContext } from "react";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import NavBar from "../../features/nav/NavBar";
import ActivityStore from "../stores/activityStore";
import { Route } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => { activityStore.loadActivities(); }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content={"Loading Activities..."} />;

  return (
    <React.Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Route exact path='/' component={HomePage} />
        <Route path='/activities' component={ActivityDashboard} />
        <Route path='/createActivity' component={ActivityForm} />
      </Container>
    </React.Fragment>
  );
};

export default observer(App);
