import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityStore from "../../../app/stores/activityStore";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { loadActivities, loadingInitial } = activityStore;

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial)
    return <LoadingComponent content={"Loading Activities..."} />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Acitivity Filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
