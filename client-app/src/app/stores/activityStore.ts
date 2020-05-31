import { setActivityProps, createAttendee } from "./../common/utils/utils";
import { RootStore } from "./rootStore";
import { history } from "./../../index";
import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import "mobx-react-lite/batchingForReactDom";
import { IActivity } from "./../models/activity";
import agent from "../api/agent";
import { toast } from "react-toastify";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;

  @action createHubConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat", {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log(this.hubConnection!.state);
      })
      .catch((error) => {
        console.log("Error establishing connection: ", error);
      });

    this.hubConnection.on("ReceiveComment", (comment) => {
      this.activity!.comments.push(comment);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.stop();
  };

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];

        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  // Load list of activities
  @action loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activities = await agent.Activities.list();

      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);

          this.activityRegistry.set(activity.id, activity);
        });

        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("loading activities error", () => {
        this.loadingInitial = false;
      });

      console.log(error);
    }
  };

  // Load a single activity
  @action loadActivity = async (id: string) => {
    this.loadingInitial = true;

    try {
      let activity = this.getActivity(id);
      if (activity) {
        this.activity = activity;
        this.loadingInitial = false;

        return activity;
      }

      activity = await agent.Activities.details(id);

      runInAction("getting activity", () => {
        setActivityProps(activity, this.rootStore.userStore.user!);

        this.activity = activity;
        this.activityRegistry.set(activity.id, activity);

        this.loadingInitial = false;
      });

      return activity;
    } catch (error) {
      runInAction("get activity error", () => {
        this.loadingInitial = false;
      });

      console.log(error);
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  // Create an activity and send to API
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);

      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;

      const attendees = [];
      attendees.push(attendee);

      activity.attendees = attendees;
      activity.isHost = true;

      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity);

        this.submitting = false;
      });

      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("creating activity error", () => {
        this.submitting = false;
      });

      toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  // Edit an activity and send to API
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.update(activity);

      runInAction("editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });

      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("editing activity error", () => {
        this.submitting = false;
      });

      toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  // Delete an activity and send to API
  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await agent.Activities.delete(id);

      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("deleting activity error", () => {
        this.submitting = false;
        this.target = "";
      });

      console.log(error);
    }
  };

  @action selectActivity = (id: string) => {
    this.activity = this.getActivity(id);
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);

    this.loading = true;

    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);

          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem siging up to activity");
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;

    try {
      await agent.Activities.unattend(this.activity!.id);

      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user!.username
          );

          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);

          this.loading = true;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem canceling attendance");
    }
  };
}
