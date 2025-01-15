import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChatContext } from '../../../context/ChatContext';
import Loader from '../../Loader';

interface ChatModalProps {
  show: boolean,
  setShow: (show: boolean) => void,
  onSubmit: () => void
}

function DeleteChatModal({ show, setShow, onSubmit }: ChatModalProps) {
  const { editingChat, isShowModalChatLoader } = useContext(ChatContext);
  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Chat {'name' in editingChat ? editingChat?.name : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isShowModalChatLoader ? <Loader /> : "Wow, do you really want to delete the chat ?"}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="light" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={() => {
            onSubmit();
          }}>
            Delete Chat
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteChatModal;