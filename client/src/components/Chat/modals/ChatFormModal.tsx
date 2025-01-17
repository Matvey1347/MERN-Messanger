import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChatContext } from '../../../context/ChatContext';
import Loader from '../../Loader';
import Form from 'react-bootstrap/esm/Form';
import { User } from '../../../interfaces/Auth';
import { EditingChat } from '../../../interfaces/Chat';
import ErrorPreview from '../../ErrorPreview';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

interface ChatModalProps {
  show: boolean,
  setShow: (show: boolean) => void,
  onSubmit: (formValues: EditingChat) => void,
}

const animatedComponents = makeAnimated();


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
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    value={formValues.members.filter((id) => {
                      const user = users.find(u => u._id === id);
                      if (!user?.name) return false; else return id;
                    }).map(id => {
                      const user = users.find(u => u._id === id);
                      return {
                        value: id,
                        label: user?.name
                      };
                    })}
                    isMulti
                    options={users.map((user: User) => ({
                      value: user._id,
                      label: user.name
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedOptionIds = selectedOptions.map(option => option.value);
                      setFormValues({ ...formValues, members: selectedOptionIds });
                    }}
                    styles={{
                      control: (provided: any) => ({
                        ...provided,
                        borderColor: '#dee2e6',
                        outlineColor: 'pink',
                        boxShadow: '0 0 0 1px #dee2e6',
                        '&:hover': {
                          borderColor: 'pink',
                          outlineColor: 'pink',
                          boxShadow: '0 0 0 1px rgb(194, 149, 157)'
                        },
                      }),
                      option: (provided: any, state: any) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? 'pink' : 'white',
                        color: state.isFocused ? 'white' : 'pink',
                        cursor: 'pointer'
                      }),
                    }}
                  />
                </Form>
                <ErrorPreview
                  error={formError}
                />
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