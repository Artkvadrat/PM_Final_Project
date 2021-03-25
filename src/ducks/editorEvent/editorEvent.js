import HTTPService from '../../services/HTTPService/HTTPService';

export const LOADED_EVENT = 'admin_panel/editor_event/loaded_event';
export const CHANGED_EVENT = 'admin_panel/editor_event/changed_field';
export const CLEAR_EVENT = 'admin_panel/editor_event/clear_field';

export const loadedEvent = (event) => ({
  type: LOADED_EVENT,
  payload: event
});

export const changedEvent = (name, value) => ({
  type: CHANGED_EVENT,
  payload: {
    fieldName: name,
    fieldValue: value
  }
});

export const clearEvent = () => ({
  type: CLEAR_EVENT
});

export const loadData = (id) => (dispatch) =>
  HTTPService.request({
    path: `/api/Events/event/${id}`
  }).then((data) => {
    dispatch(loadedEvent(data));
  });

export const changeFieldEvent = (fieldName, fieldValue) => (dispatch) => {
  dispatch(changedEvent(fieldName, fieldValue));
};

export const saveEvent = (data) => (dispatch) =>
  HTTPService.request({
    method: 'PUT',
    path: '/api/Events/edit',
    body: { ...data }
  }).then(() => {
    dispatch(clearEvent());
  });

const initialState = {
  event: {
    id: '',
    margin: 0,
    startTime: ''
  },
  isLoading: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADED_EVENT:
      return {
        ...state,
        isLoading: false,
        event: {
          id: action.payload.id,
          margin: action.payload.margin,
          startTime: action.payload.startTime.substr(0, 19)
        }
      };
    case CHANGED_EVENT:
      return {
        ...state,
        event: {
          ...state.event,
          [action.payload.fieldName]: action.payload.fieldValue
        }
      };
    case CLEAR_EVENT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
