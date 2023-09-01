"use client";

import { useBoardStore } from "@/store/BoardStore";

const types = [
  {
    id: "todo",
    name: "Todo",
    description: "A new task to be completed",
    color: "bg-red-500",
  },
  {
    id: "inprogress",
    name: "In Progress",
    description: "A task that is currently being worked on",
    color: "bg-yellow-500",
  },
  {
    id: "done",
    name: "Done",
    description: "A task tht has been completed",
    color: "bg-green-500",
  },
];

const TaskTypeRadioGroup = () => {
  const [setTaskType, newTaskType] = useBoardStore((state) => [
    state.setTaskType,
    state.newTaskType,
  ]);

  return <div>TaskTypeRadioGroup</div>;
};

export default TaskTypeRadioGroup;
