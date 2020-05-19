import React, { useEffect, useContext } from "react";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import NavBar from "../../features/nav/NavBar";
import ActivityStore from "../stores/activityStore";

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => { activityStore.loadActivities(); }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content={"Loading Activities..."} />;

  return (
    <React.Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard />
      </Container>
    </React.Fragment>
  );
};

export default observer(App);
