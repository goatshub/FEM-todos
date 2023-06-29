import { auth, db } from "@/config/firebase";
import { FormType, HandleSubmit } from "@/type/Type";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import Image from "next/image";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import SignInButton from "./signinButton";

const Form = ({ setTodoObjectById, setIndexId }: FormType) => {
  const [content, setContent] = useState("");
  const [completed, setCompleted] = useState(false);
  const [user] = useAuthState(auth);

  const handleSubmit: HandleSubmit = async (e) => {
    e.preventDefault();

    /** Update Todo to DB */
    const newTodo = {
      completed,
      content,
      uId: user?.uid,
      // index: todosInfos.length,
      // timestamp: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, "todo"), newTodo);
    const id = docRef.id;

    /** Update indexArr to DB */
    const q = query(
      collection(db, "indexId"),
      limit(1),
      where("uId", "==", user?.uid)
    );
    const indexIdDocsRef = await getDocs(q);
    if (indexIdDocsRef.empty) {
      //create indexIdDoc of user into db
      await addDoc(collection(db, "indexId"), {
        uId: user?.uid,
        indexArr: [id],
      });
    } else {
      //update indexIdDoc of user into db
      const indexIdDoc = doc(db, "indexId", indexIdDocsRef.docs[0].id);
      await updateDoc(indexIdDoc, { indexArr: arrayUnion(id) });
    }

    /** Set states */
    setTodoObjectById((prev) => ({
      ...prev,
      [docRef.id]: { ...newTodo, id },
    }));
    setIndexId((prev) => [...prev, id]);

    /** Reset form */
    setContent("");
    setCompleted(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <SignInButton />
      <div
        className="flex items-center rounded-md py-3 px-5 gap-5
        bg-white dark:bg-darkBlue dark:text-gray-200
      "
      >
        <label className="cursor-pointer group">
          <input
            type="checkbox"
            name="completed"
            className="h-5 w-5 peer hidden"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
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
        </label>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="outline-none w-full bg-transparent"
          placeholder="Create a new todo"
          required
        />
      </div>
    </form>
  );
};
export default Form;
