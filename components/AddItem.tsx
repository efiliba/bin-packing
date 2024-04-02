import { useReducer, ChangeEvent } from 'react';

import { Input } from '@/components/ui';

enum ActionType {
  UPDATE_WIDTH = 'UPDATE_WIDTH',
  UPDATE_HEIGHT = 'UPDATE_HEIGHT',
  UPDATE_QUANTITY = 'UPDATE_QUANTITY',
}

type State = {
  width: number;
  height: number;
  quantity: number;
};

type CBFunction = (state: State) => void;

type Action =
  | { type: ActionType.UPDATE_WIDTH; payload: { width: number; cb: CBFunction; }; }
  | { type: ActionType.UPDATE_HEIGHT; payload: { height: number; cb: CBFunction; }; }
  | { type: ActionType.UPDATE_QUANTITY; payload: { quantity: number; cb: CBFunction; }; };

type UpdateWidthActionCreator = {
  type: ActionType.UPDATE_WIDTH;
  payload: {
    width: number;
    cb: CBFunction;
  };
};

type UpdateHeightActionCreator = {
  type: ActionType.UPDATE_HEIGHT;
  payload: {
    height: number;
    cb: CBFunction;
  };
};

type UpdateHeightQuantityCreator = {
  type: ActionType.UPDATE_QUANTITY;
  payload: {
    quantity: number;
    cb: CBFunction;
  };
};

const ActionCreator = {
  updateWidth: (cb: CBFunction) => (width: number) => ({ type: ActionType.UPDATE_WIDTH, payload: { width, cb } }),
  updateHeight: (cb: CBFunction) => (height: number) => ({ type: ActionType.UPDATE_HEIGHT, payload: { height, cb } }),
  updateQuantity: (cb: CBFunction) => (quantity: number) => ({ type: ActionType.UPDATE_QUANTITY, payload: { quantity, cb } })
};

const reducer = (state: State, action: Action) => {
  const nextState = (state: State, action: Action) => {
    switch (action.type) {
      case ActionType.UPDATE_WIDTH:
        return {
          ...state,
          width: isNaN(action.payload.width) ? 0 : action.payload.width
        };
      case ActionType.UPDATE_HEIGHT:
        return {
          ...state,
          height: isNaN(action.payload.height) ? 0 : action.payload.height
        };
      case ActionType.UPDATE_QUANTITY:
        return {
          ...state,
          quantity: isNaN(action.payload.quantity) ? 0 : action.payload.quantity
        };
      default:
        return state;
    }
  };

  const newState = nextState(state, action);
  action.payload.cb(newState);

  return newState;
};

type Props = Partial<State> & {
  color: string;
  onWidthChange: (values: State) => void;
  onHeightChange: (values: State) => void;
  onQuantityChange: (values: State) => void;
};

export const AddItem = ({ width = 0, height = 0, quantity = 0, color, onWidthChange, onHeightChange, onQuantityChange }: Props) => {
  const [ state, dispatch ] = useReducer(reducer, { width, height, quantity });

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(ActionCreator.updateWidth(onWidthChange)(e.target.valueAsNumber) as UpdateWidthActionCreator);

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(ActionCreator.updateHeight(onHeightChange)(e.target.valueAsNumber) as UpdateHeightActionCreator);

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(ActionCreator.updateQuantity(onQuantityChange)(e.target.valueAsNumber) as UpdateHeightQuantityCreator);

  return (
    <>
      <div className="aspect-square" style={{ backgroundColor: color }} />
      <Input className="text-right" type="number" min={0} value={state.width} onChange={handleWidthChange} />
      <Input className="text-right" type="number" min={0} value={state.height} onChange={handleHeightChange} />
      <Input className="text-right" type="number" min={0} value={state.quantity} onChange={handleQuantityChange} />
    </>
  );
};
