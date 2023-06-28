import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export type MainSectionType = {};

export type HeaderType = {
  darkmode: boolean;
  setDarkmode: Dispatch<SetStateAction<boolean>>;
};

export type Todo = {
  id: number;
  completed: boolean;
  content: string;
  index: number;
};

export type FormType = {
  setTodosInfos: Dispatch<SetStateAction<Todo[]>>;
};
/**
 * const handleSubmit: HandleSubmit = (e) => {
 *    e.preventDefault();
 *    ...
 *  }
 */
export type HandleSubmit = (e: SyntheticEvent) => void;

export type TodoItem = {
  setTodosInfos: Dispatch<SetStateAction<Todo[]>>;
  todoItem: Todo;
  index: number;
};

export type FilterType = boolean | undefined;

export type MenuFilter = {
  setFilter: Dispatch<SetStateAction<FilterType>>;
  filter: FilterType;
  incompletedTodos: Todo[];
  handleClearComplete: () => void;
};
