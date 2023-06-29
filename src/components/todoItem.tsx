import { HandleComplete, RemoveTodo, TodoItem } from "@/type/Type";
import Image from "next/image";
import { Draggable } from "react-beautiful-dnd";
import {
  updateDoc,
  doc,
  deleteDoc,
  query,
  collection,
  getDocs,
  arrayRemove,
  where,
} from "firebase/firestore/lite";
import { auth, db } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const TodoItem = ({
  todoItem,
  setIndexId,
  setTodoObjectById,
  index,
}: TodoItem) => {
  const { id, completed, content } = todoItem;
  const [user] = useAuthState(auth);

  const handleComplete: HandleComplete = async (id) => {
    /** Update Todo to DB */
    await updateDoc(doc(db, "todo", id), {
      completed: !completed,
    });

    setTodoObjectById((prev) => {
      return {
        ...prev,
        [id]: { ...prev[id], completed: !completed },
      };
    });
  };

  const removeTodo: RemoveTodo = async (id) => {
    /** Update Todo to DB */
    await deleteDoc(doc(db, "todo", id));

    /** Update indexArr to DB */
    const q = query(collection(db, "indexId"), where("uId", "==", user?.uid));
    const indexIdDocsRef = await getDocs(q);
    const indexIdDoc = doc(db, "indexId", indexIdDocsRef.docs[0].id);
    await updateDoc(indexIdDoc, { indexArr: arrayRemove(id) });

    /** set states */
    setTodoObjectById((prev) => {
      let updatedTodoObjectById = { ...prev };
      delete updatedTodoObjectById[id];
      return updatedTodoObjectById;
    });
    setIndexId((prev) => prev.filter((indexId) => indexId !== id));
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
