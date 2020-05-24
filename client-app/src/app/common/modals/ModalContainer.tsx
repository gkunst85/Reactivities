import React, { useContext } from "react";
import { Modal } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";
import { observer } from "mobx-react-lite";

const ModalContainer = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, body, closeOnDimmerClick },
    closeModal,
  } = rootStore.modalStore;
  return (
    <Modal
      open={open}
      onClose={closeModal}
      size="mini"
      closeOnDimmerClick={closeOnDimmerClick}
    >
      <Modal.Content content={body} />
    </Modal>
  );
};

export default observer(ModalContainer);
