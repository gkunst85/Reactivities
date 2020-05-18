import React, { useState, useEffect, SyntheticEvent, useContext } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import { observer } from "mobx-react-lite";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agents from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";

const App = () => {
  const activityStore = useContext(ActivityStore);

  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSsubmitting] = useState(false);
  const [target, setTarget] = useState("");

  // const handleSelectActivity = (id: string) => {
  //   const activity = activities.filter((x) => x.id === id)[0];
  //   setSelectedActivity(activity);
  //   setEditMode(false);
  // };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setSsubmitting(true);

    agents.Activities.create(activity)
      .then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => {
        setSsubmitting(false);
      });
  };

  const handleEditActivity = (activity: IActivity) => {
    setSsubmitting(true);

    agents.Activities.update(activity)
      .then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => {
        setSsubmitting(false);
      });
  };

  const handleDeleteActivity = (
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSsubmitting(true);
    setTarget(e.currentTarget.name);

    agents.Activities.delete(id)
      .then(() => {
        const newActivities = activities.filter((x) => x.id !== id);
        setActivities(newActivities);
      })
      .then(() => {
        setSsubmitting(false);
      });
  };

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content={"Loading Activities..."} />;

  return (
    <React.Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          selectedActivity={selectedActivity}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </React.Fragment>
  );
};

export default observer(App);
