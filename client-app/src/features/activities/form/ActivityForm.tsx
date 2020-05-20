import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid, GridColumn } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { IActivity } from "../../../app/models/activity";

interface FormParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<FormParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    activity: initialFormState,
    createActivity,
    editActivity,
    loadActivity,
    clearActivity,
    loadingInitial,
    submitting,
  } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(() => {
        initialFormState && setActivity(initialFormState);
      });
    }

    return function cleanup() {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    initialFormState,
    match.params.id,
    activity.id.length,
  ]);

  const handleSubmit = () => {
    if (activity.id.length !== 0)
      return editActivity(activity).then(() => {
        history.push(`/activities/${activity.id}`);
      });

    const newActivity = {
      ...activity!,
      id: uuid(),
    };

    createActivity(newActivity).then(() => {
      history.push(`/activities/${newActivity.id}`);
    });
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  if (loadingInitial || !activity)
    return <LoadingComponent content="Loading activity..." />;

  return (
    <Grid>
      <GridColumn width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              name="title"
              onChange={handleInputChange}
              placeholder="Title"
              value={activity.title}
            />
            <Form.TextArea
              name="description"
              onChange={handleInputChange}
              rows={2}
              placeholder="Description"
              value={activity.description}
            />
            <Form.Input
              name="category"
              onChange={handleInputChange}
              placeholder="Category"
              value={activity.category}
            />
            <Form.Input
              name="date"
              onChange={handleInputChange}
              type="datetime-local"
              placeholder="Date"
              value={activity.date}
            />
            <Form.Input
              name="city"
              onChange={handleInputChange}
              placeholder="City"
              value={activity.city}
            />
            <Form.Input
              name="venue"
              onChange={handleInputChange}
              placeholder="Venue"
              value={activity.venue}
            />
            <Button
              loading={submitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              onClick={() => history.push("/activities")}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        </Segment>
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityForm);
