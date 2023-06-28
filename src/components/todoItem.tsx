import { TodoItem } from "@/type/Type";
import Image from "next/image";
import { Draggable } from "react-beautiful-dnd";

const TodoItem = ({ todoItem, setTodosInfos, index }: TodoItem) => {
  const { id, completed, content } = todoItem;
  const handleComplete = (id: number) => {
    setTodosInfos((prev) => {
      let updatedTodos = prev.map((item) => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        } else {
          return item;
        }
      });
      return updatedTodos;
    });
  };
  const removeTodo = (id: number) => {
    setTodosInfos((prev) => prev.filter((item) => item.id !== id));
  };
  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) => (
        <div
          className="flex items-center justify-between py-3 px-5  group
    bg-white dark:bg-darkBlue rounded-md
      border-b dark:border-gray-700 dark:text-gray-200
    "
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <label className="cursor-pointer flex items-center gap-5 group">
            <input
              type="checkbox"
              name="completed"
              className="h-5 w-5 peer hidden"
              checked={completed}
              onChange={(e) => handleComplete(id)}
            />
            <div
              className="h-5 w-5 border border-neutral-400 rounded-full 
              grid place-items-center 
              group-hover:border-purple-500 
              peer-checked:bg-gradient-to-br 
              peer-checked:from-sky-300 peer-checked:to-purple-500"
            >
              {completed && (
                <Image
                  src="/images/icon-check.svg"
                  width={11}
                  height={9}
                  alt="check"
                />
              )}
            </div>
            <p className="peer-checked:text-gray-500 peer-checked:line-through">
              {content}
            </p>
          </label>
          <Image
            src="/images/icon-cross.svg"
            width={12}
            height={12}
            alt="remove todo"
            className="hover:cursor-pointer hover:opacity-70 hidden group-hover:block "
            onClick={(e) => removeTodo(id)}
          />
        </div>
      )}
    </Draggable>
  );
};
export default TodoItem;
