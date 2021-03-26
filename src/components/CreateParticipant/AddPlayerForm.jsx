import React from 'react';
import { Button, Form, Input, Row } from 'antd';
import PropTypes from 'prop-types';

import AddingParameters from './AddingParameters';

const AddPlayerForm = ({
  changeShowingForm,
  newParticipant,
  addNewParameters,
  addData,
  submitHandler
}) => {
  const canAddNewParameter = !newParticipant.parameters[
    newParticipant.parameters.length - 1
  ].type;

  const changeNameHandler = (e) => {
    addData(e.target.value, 'changePlayerName');
  };

  const changePhotoLinkHandler = (e) => {
    addData(e.target.value, 'changePlayerPhotoLink');
  };

  const submitForm = () => {
    submitHandler('playerSubmit');
  };

  const addParameter = () => addNewParameters('parameterForPlayer');

  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{
        textAlign: 'center',
        paddingTop: '200px',
        flexDirection: 'column'
      }}
    >
      <h2>Adding player</h2>
      <div>
        <Button disabled style={{ margin: '15px' }}>
          Add player
        </Button>
        <Button
          type="primary"
          style={{ margin: '15px' }}
          onClick={changeShowingForm}
        >
          Add team
        </Button>
      </div>
      <Form layout="vertical" onFinish={submitForm}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter name'
            }
          ]}
        >
          <Input onChange={changeNameHandler} />
        </Form.Item>
        <Form.Item
          label="Link to photo"
          name="photoLink"
          rules={[
            {
              required: true,
              message: 'Please enter link to photo'
            },
            {
              pattern: /.png$/,
              message: 'Enter .png photo please'
            }
          ]}
        >
          <Input onChange={changePhotoLinkHandler} />
        </Form.Item>
        <div style={{ textAlign: 'left' }}>
          <p>Parameters</p>
          {newParticipant.parameters.map((item, id) => (
            <AddingParameters
              key={id}
              initialData={item}
              id={id}
              addData={addData}
              type="playerParameters"
            />
          ))}
        </div>
        <Form.Item>
          <Button onClick={addParameter} disabled={canAddNewParameter}>
            Add new parameter
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
};

AddPlayerForm.propTypes = {
  changeShowingForm: PropTypes.func,
  newParticipant: PropTypes.object,
  addNewParameters: PropTypes.func,
  addData: PropTypes.func,
  submitHandler: PropTypes.func
};

export default AddPlayerForm;
