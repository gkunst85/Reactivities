import { history } from "./../../index";
import { RootStore } from "./rootStore";
import { IUser } from "./../models/user";
import { observable, computed, action, runInAction } from "mobx";
import { IUserFormValues } from "../models/user";
import agent from "../api/agent";

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);

      runInAction(() => {
        this.user = user;
      });

      console.log(user);
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };
}
