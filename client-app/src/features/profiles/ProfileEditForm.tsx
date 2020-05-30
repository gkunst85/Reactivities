import React from "react";
import { observer } from "mobx-react-lite";
import { combineValidators, isRequired } from "revalidate";
import { IProfile } from "../../app/models/profile";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";

const validate = combineValidators({
  displayName: isRequired("displayName"),
});

interface IProps {
  profile: IProfile;
  updateProfile: (profile: IProfile) => void;
}

const ProfileEditForm: React.FC<IProps> = ({ profile, updateProfile }) => {
  return (
    <FinalForm
      onSubmit={updateProfile}
      validate={validate}
      initialValues={profile!}
      render={({ handleSubmit, invalid, pristine, submitting }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            component={TextInput}
            name="displayName"
            placeholder="Display Name"
            value={profile!.displayName}
          />
          <Field
            component={TextAreaInput}
            name="bio"
            placeholder="Bio"
            value={profile!.bio}
          />
          <Button
            loading={submitting}
            floated="right"
            disabled={invalid || pristine}
            positive
            content="Update Profile"
          />
        </Form>
      )}
    ></FinalForm>
  );
};

export default observer(ProfileEditForm);
