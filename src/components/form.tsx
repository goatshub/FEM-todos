import { FormType, HandleSubmit } from "@/type/Type";
import Image from "next/image";
import { useState } from "react";

const Form = ({ setTodosInfos }: FormType) => {
  const [content, setContent] = useState("");
  const [completed, setCompleted] = useState(false);
  const handleSubmit: HandleSubmit = (e) => {
    e.preventDefault();
    setTodosInfos((prev) => [
      ...prev,
      {
        id: new Date().getTime() + Math.random(),
        completed,
        content,
        index: prev.length,
      },
    ]);
    setContent("");
    setCompleted(false);
  };
  return (
    <form onSubmit={handleSubmit}>
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
