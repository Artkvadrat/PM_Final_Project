import React from 'react';
import { shallow, mount } from 'enzyme';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  loadData,
  createEvent,
  changeFieldEvent,
  clearData
} from '../../ducks/creatorEvent/creatorEvent';

import '../../setupTests';

import CreatorEvent from './CreatorEvent';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn()
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('../../ducks/creatorEvent/creatorEvent', () => ({
  loadData: jest.fn(),
  createEvent: jest.fn(),
  changeFieldEvent: jest.fn(),
  clearData: jest.fn()
}));

describe('CreatorEvent component', () => {
  const history = {
    push: jest.fn()
  };
  const dispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatch);
    useHistory.mockReturnValue(history);
    loadData.mockReturnValue(Symbol.for('load'));
    changeFieldEvent.mockReturnValue(Symbol.for('change'));
    clearData.mockReturnValue(Symbol.for('clear'));
    createEvent.mockReturnValue(Symbol.for('create'));
    jest.clearAllMocks();
    useSelector.mockReturnValue({
      participants: [
        { id: '2', name: 'vlad' },
        { id: '3', name: 'vova' }
      ],
      sports: [{ id: 1, name: 'UFC' }],
      addEvent: {
        participant_Id1: '2',
        participant_Id2: '3',
        startTime: '2021-03-23T05:50:49',
        margin: 5
      }
    });
  });

  it('should dispatch  action on mount', () => {
    expect(dispatch).not.toHaveBeenCalled();
    expect(loadData).not.toHaveBeenCalled();

    const result = mount(<CreatorEvent />);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(Symbol.for('load'));
    expect(loadData).toHaveBeenCalledTimes(1);
  });
  it('should render form', () => {
    const result = shallow(<CreatorEvent />);
    const form = result.find('.form-creator');
    expect(form.exists()).toEqual(true);
    expect(result).toMatchSnapshot();
  });
  it('should create event on submit form', () => {
    const addEvent = {
      participant_Id1: '2',
      participant_Id2: '3',
      startTime: '2021-03-23T05:50:49',
      margin: 5
    };

    const result = shallow(<CreatorEvent />);
    const fakeEvent = {
      preventDefault: jest.fn()
    };

    const form = result.find('.form-creator');
    form.simulate('submit', fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(createEvent).toHaveBeenCalledTimes(1);
    expect(createEvent).toHaveBeenCalledWith(addEvent);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(Symbol.for('clear'));
    expect(clearData).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledTimes(1);
  });
  it("shouldn't create event on submit form", () => {
    useSelector.mockReturnValue({
      participants: [
        { id: '2', name: 'vlad' },
        { id: '3', name: 'vova' }
      ],
      sports: [{ id: 1, name: 'UFC' }],
      addEvent: {
        participant_Id1: '',
        participant_Id2: '',
        startTime: '2021-03-23T05:50:49',
        margin: 5
      }
    });

    const result = shallow(<CreatorEvent />);
    const fakeEvent = {
      preventDefault: jest.fn()
    };
    const form = result.find('.form-creator');
    form.simulate('submit', fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(Symbol.for('change'));
    expect(changeFieldEvent).toHaveBeenCalledTimes(2);
    expect(createEvent).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalledWith(Symbol.for('clear'));
    expect(clearData).not.toHaveBeenCalled();
    expect(history.push).not.toHaveBeenCalled();
  });
  it('should dispatch changeFieldEvent action on change field form', () => {
    const result = shallow(<CreatorEvent />);
    const fakeEventMargin = {
      target: {
        name: 'margin',
        value: '4'
      }
    };
    const fakeEventDate = {
      target: {
        name: 'startTime',
        value: '2021-05-23T11:18:21'
      }
    };

    const margin = result.find('.margin-value');
    margin.simulate('change', fakeEventMargin);
    const date = result.find('.start-data');
    date.simulate('change', fakeEventDate);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(changeFieldEvent).toHaveBeenCalledTimes(2);
    expect(changeFieldEvent).toHaveBeenNthCalledWith(1, 'margin', 4);
    expect(changeFieldEvent).toHaveBeenNthCalledWith(
      2,
      'startTime',
      '2021-05-23T11:18:21'
    );
    expect(dispatch).toHaveBeenCalledWith(Symbol.for('change'));
  });
  it('should render selects for partisipants', () => {
    const participants = [
      { id: '2', name: 'vlad' },
      { id: '3', name: 'vova' }
    ];
    useSelector.mockReturnValue({
      participants,
      sports: [{ id: 1, name: 'UFC' }],
      addEvent: {
        participant_Id1: '',
        participant_Id2: '',
        startTime: '2021-03-23T05:50:49',
        margin: 5
      }
    });
    const result = shallow(<CreatorEvent />);
    const options1 = result.find('.player1-option');
    const options2 = result.find('.player2-option');

    expect(options1.length).toBe(participants.length);
    expect(options2.length).toBe(participants.length);
    for (let i = 0; i < options1.length; i++) {
      const option = options1.at(i);
      expect(option.prop('value')).toBe(participants[i].id);
    }

    for (let i = 0; i < options2.length; i++) {
      const option = options2.at(i);
      expect(option.prop('value')).toBe(participants[i].id);
    }
    expect(result).toMatchSnapshot();
  });
});
