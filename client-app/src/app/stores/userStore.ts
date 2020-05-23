import { IUser } from "./../models/user";
import { createContext } from "react";
import { observable, computed, action } from "mobx";
import { IUserFormValues } from "../models/user";
import agent from "../api/agent";

class UserStore {
  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      this.user = user;
    } catch (error) {
      console.log(error);
    }
  };
}

export default createContext(new UserStore());
