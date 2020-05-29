import { configure } from "mobx";
import { createContext } from "react";
import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfilesStore from "./profilesStore";

configure({ enforceActions: "always" });

export class RootStore {
  activityStore: ActivityStore;
  userStore: UserStore;
  commonStore: CommonStore;
  modalStore: ModalStore;
  profilesStore: ProfilesStore;

  constructor() {
    this.activityStore = new ActivityStore(this);
    this.userStore = new UserStore(this);
    this.commonStore = new CommonStore(this);
    this.modalStore = new ModalStore(this);
    this.profilesStore = new ProfilesStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
