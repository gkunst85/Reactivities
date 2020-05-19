import React, { FormEvent, useContext } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivityStore from '../../../app/stores/activityStore';

const ActivityForm: React.FC = () => {

  const activityStore = useContext(ActivityStore);
  const { selectedActivity, createActivity, editActivity, cancelFormOpen, submitting } = activityStore;

  const initalizeForm = () => {
    if (selectedActivity) return selectedActivity;

    return {
      id: "",
      title: "",
      category: "",
      description: "",
      date: "",
      city: "",
      venue: "",
    };
  };

  const activity = initalizeForm();

  const handleSubmit = () => {
    if (activity!.id.length !== 0) return editActivity(activity!);

    const newActivity = {
      ...activity!,
      id: uuid(),
    };

    createActivity(newActivity);
  };

  const handleOnChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    editActivity({ ...activity!, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          name="title"
          onChange={handleOnChange}
          placeholder="Title"
          value={activity!.title}
        />
        <Form.TextArea
          name="description"
          onChange={handleOnChange}
          rows={2}
          placeholder="Description"
          value={activity!.description}
        />
        <Form.Input
          name="category"
          onChange={handleOnChange}
          placeholder="Category"
          value={activity!.category}
        />
        <Form.Input
          name="date"
          onChange={handleOnChange}
          type="datetime-local"
          placeholder="Date"
          value={activity!.date}
        />
        <Form.Input
          name="city"
          onChange={handleOnChange}
          placeholder="City"
          value={activity!.city}
        />
        <Form.Input
          name="venue"
          onChange={handleOnChange}
          placeholder="Venue"
          value={activity!.venue}
        />
        <Button
          loading={submitting}
          floated="right"
          positive
          type="submit"
          content="Submit"
        />
        <Button
          onClick={() => cancelFormOpen()}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
