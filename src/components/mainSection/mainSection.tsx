import { FilterType, MainSectionType, Todo } from "@/type/Type";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Form from "../form";
import TodoItem from "../todoItem";
import { useState } from "react";
import MenuFilter from "../menuFilter";
const MainSection = () => {
  const [todosInfos, setTodosInfos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>();
  let todosInfosFiltered =
    filter !== undefined
      ? todosInfos.filter((todo) => todo.completed === filter)
      : todosInfos;
  todosInfosFiltered = todosInfosFiltered.sort((todo) => todo.index);
  const incompletedTodos = todosInfos.filter((todo) => !todo.completed);

  const handleClearComplete = () => {
    setTodosInfos((prev) => {
      return prev.filter((item) => !item.completed);
    });
  };
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    setTodosInfos((prev) => {
      let newTodos = [...prev];
      const todoToMove = newTodos.splice(result.source.index, 1);
      result.destination &&
        newTodos.splice(result?.destination.index, 0, ...todoToMove);
      newTodos = newTodos.map((todo, index) => ({ ...todo, index }));
      return newTodos;
    });
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Form setTodosInfos={setTodosInfos} />
      <section
        className="
        shadow-[0_30px_60px_-10px_rgba(6,0,74,0.15)] relative
        bg-white dark:bg-darkBlue rounded-md
      "
      >
        <section className="max-h-todos">
          <Droppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {todosInfosFiltered.map((todoItem, index) => (
                  <TodoItem
                    key={todoItem.id}
                    todoItem={todoItem}
                    setTodosInfos={setTodosInfos}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </section>
        <MenuFilter
          handleClearComplete={handleClearComplete}
          setFilter={setFilter}
          filter={filter}
          incompletedTodos={incompletedTodos}
        />
      </section>
    </DragDropContext>
  );
};
export default MainSection;
