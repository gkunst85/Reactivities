import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "./../models/activity";
import agent from "../api/agent";

configure({ enforceActions: 'always' });

class ActivityStore {

  @observable activityRegistry = new Map();
  // @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    const activities = Array.from(this.activityRegistry.values());
    activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    return activities;
  }

  // Load activities from API
  @action loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activities = await agent.Activities.list();

      runInAction('loading activities', () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];

          this.activityRegistry.set(activity.id, activity);
        });

        this.loadingInitial = false;
      })
    }
    catch (error) {
      runInAction('loading activities error', () => {
        this.loadingInitial = false;
      });

      console.log(error);
    }
  };

  // Create an activity and send to API
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {

      await agent.Activities.create(activity);

      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);

        this.editMode = false;
        this.submitting = false;
      })
    }
    catch (error) {
      runInAction('creating activity error', () => {
        this.submitting = false;
      });

      console.log(error);
    }
  }

  // Edit an activity and send to API
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.update(activity);

      runInAction('editing activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      })
    }
    catch (error) {
      runInAction('editing activity error', () => {
        this.submitting = false;
      });

      console.log(error);
    }
  }

  // Delete an activity and send to API
  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await agent.Activities.delete(id);

      runInAction('deleting activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    }
    catch (error) {
      runInAction('deleting activity error', () => {
        this.submitting = false;
        this.target = "";
      });

      console.log(error);
    }
  }

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  }

  @action openEditForm = (id: string) => {
    this.editMode = true;
    this.selectedActivity = this.activityRegistry.get(id);
  }

  @action cancelFormOpen = () => {
    this.editMode = false;
  }

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);

    this.editMode = false;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;

    this.editMode = false;
  }
}

export default createContext(new ActivityStore());
