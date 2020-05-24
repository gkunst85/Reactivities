import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class ModalStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable.shallow modal = {
    open: false,
    body: null,
    closeOnDimmerClick: true,
  };

  @action openModal = (content: any, closeOnDimmerClick = true) => {
    this.modal.open = true;
    this.modal.closeOnDimmerClick = closeOnDimmerClick;
    this.modal.body = content;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}
