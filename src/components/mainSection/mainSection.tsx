import { FilterType, IndexId, Todo, TodoObjectById } from "@/type/Type";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Form from "../form";
import TodoItem from "../todoItem";
import { useEffect, useState } from "react";
import MenuFilter from "../menuFilter";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore/lite";
import { auth, db } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const MainSection = () => {
  const [todoObjectById, setTodoObjectById] = useState<TodoObjectById>({});
  const [indexId, setIndexId] = useState<IndexId>([]);
  const [filter, setFilter] = useState<FilterType>();
  const [user, loading] = useAuthState(auth);
  const todosInfos = indexId.map((id) => todoObjectById[id]);

  useEffect(() => {
    const getData = async () => {
      if (user && !loading) {
        const getTodoDocs = async () => {
          const q = query(collection(db, "todo"), where("uId", "==", user.uid));
          const docsRef = await getDocs(q);
          if (docsRef.empty) {
            return {};
          } else {
            let todoObjectById: TodoObjectById = {};
            docsRef.forEach((doc) => {
              let docData = doc.data();
              todoObjectById[doc.id] = { ...docData, id: doc.id } as Todo;
            });
            return todoObjectById;
          }
        };
        const getIndexIdDocs = async () => {
          const q = query(
            collection(db, "indexId"),
            limit(1),
            where("uId", "==", user.uid)
          );
          const docsRef = await getDocs(q);
          if (docsRef.empty) {
            return [];
          } else {
            let docData = docsRef.docs[0].data();
            let indexId = docData.indexArr as IndexId;
            return indexId;
          }
        };
        const todoObjectById = await getTodoDocs();
        const indexId = await getIndexIdDocs();
        setTodoObjectById(todoObjectById);
        setIndexId(indexId);
      }
    };
    getData();
  }, [user, loading]);

  const todosInfosFiltered =
    filter !== undefined
      ? todosInfos.filter((todo) => todo.completed === filter)
      : todosInfos;
  const incompletedTodos = todosInfos.filter((todo) => !todo.completed);

  const handleClearComplete = async () => {
    const updatedTodoObjectById = { ...todoObjectById };
    const batch = writeBatch(db);
    const updatedIndexId = todosInfos
      .filter((item) => {
        if (!item.completed) {
          //keep active
          return true;
        } else {
          //remove completed from database
          delete updatedTodoObjectById[item.id];
          const docRef = doc(db, "todo", item.id);
          batch.delete(docRef);
          return false;
        }
      })
      .map((item) => item.id);
    setTodoObjectById(updatedTodoObjectById);
    setIndexId(updatedIndexId);

    /** Update indexArr to DB */
    const q = query(collection(db, "indexId"), where("uId", "==", user?.uid));
    const indexIdDocsRef = await getDocs(q);
    const indexIdDoc = doc(db, "indexId", indexIdDocsRef.docs[0].id);
    await updateDoc(indexIdDoc, { indexArr: updatedIndexId });

    /** Update todo to DB */
    await batch.commit();
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }

    let updatedIndexId = [...indexId];
    const indexIdToMove = updatedIndexId.splice(result.source.index, 1);
    updatedIndexId.splice(result.destination.index, 0, ...indexIdToMove);

    setIndexId(updatedIndexId);

    /** Update indexArr to DB */
    const q = query(collection(db, "indexId"), where("uId", "==", user?.uid));
    const indexIdDocsRef = await getDocs(q);
    const indexIdDoc = doc(db, "indexId", indexIdDocsRef.docs[0].id);
    await updateDoc(indexIdDoc, { indexArr: updatedIndexId });
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Form setIndexId={setIndexId} setTodoObjectById={setTodoObjectById} />
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
                    setTodoObjectById={setTodoObjectById}
                    setIndexId={setIndexId}
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
