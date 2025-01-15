import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChatContext } from '../../../context/ChatContext';
import Loader from '../../Loader';
import Form from 'react-bootstrap/esm/Form';
import { User } from '../../../interfaces/Auth';
import Alert from 'react-bootstrap/esm/Alert';
import { EditingChat } from '../../../interfaces/Chat';

interface ChatModalProps {
  show: boolean,
  setShow: (show: boolean) => void,
  onSubmit: (formValues: EditingChat) => void,
}

function ChatFormModal({ show, setShow, onSubmit }: ChatModalProps) {
  const { editingChat, isShowModalChatLoader, users } = useContext(ChatContext);

  const [formValues, setFormValues] = useState<EditingChat>(
    {
      name: "",
      members: []
    }
  );

  const [formError, setFormError] = useState("");

  useEffect(() => {
    const chat = editingChat as EditingChat;
    setFormValues({
      name: chat.name || "",
      members: chat.members || []
    });
  }, [editingChat]);

  function onFormSubmit() {
    setFormError("");
    if (!formValues.name) {
      return setFormError("Name is required!");
    } else if (formValues.members.length === 0) {
      return setFormError("In the chat, there must be at least two participants");
    }

    onSubmit(formValues);
  }

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {('name' in editingChat) ? `Editing ${editingChat.name} Chat` : "Create New Chat"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            isShowModalChatLoader
              ? <Loader />
              :
              <>
                <Form>
                  <Form.Control
                    type="text"
                    className="mb-2"
                    placeholder="Chat name"
                    value={formValues.name}
                    onChange={(e) => {
                      setFormValues({ ...formValues, name: e.target.value })
                    }}
                  />
                  <Form.Select
                    multiple
                    value={formValues.members}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setFormValues({ ...formValues, members: selectedOptions });
                    }}
                  >
                    {users.map((user: User) => {
                      return <option value={user._id} key={user._id}>{user.name + " -> " + user.email}</option>
                    })}
                  </Form.Select>
                </Form>
                {formError ?
                  <Alert variant="danger" className="mt-2 mb-0">
                    <p className="mb-0 text-center">{formError}</p>
                  </Alert>
                  : ""
                }
              </>
          }
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="light" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="dark" onClick={() => {
            onFormSubmit();
          }}>
            {('name' in editingChat) ? "Save Changes" : "Create Chat"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChatFormModal;