import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Tab, Grid, Header, Button } from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";
import { observer } from "mobx-react-lite";
import { IProfile } from "../../app/models/profile";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { updateProfile, profile, isCurrentUser } = rootStore.profilesStore;

  const [editMode, setEditMode] = useState(false);

  const handleUpdateProfile = (profile: Partial<IProfile>) => {
    updateProfile(profile);
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={`About ${profile!.displayName}`}
          />

          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm
              updateProfile={handleUpdateProfile}
              profile={profile!}
            />
          ) : (
            <span>{profile!.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
