import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tasksApi } from "@/entities/task/api/tasksApi";
import type { TaskFormValues } from "@/features/task-form";
import type { Task } from "@prisma/client";
import { useFormContext } from "react-hook-form";

export const useTask = (id: string) => {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useFormContext();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await tasksApi.getById(id);
        setTask(taskData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        router.push("/");
      }
    };

    fetchTask();
  }, [id, router]);

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      setIsSubmitting(true);
      await tasksApi.update(id, values);
      if (task) {
        const updatedTask = {
          ...task,
          title: values.title,
          description: values.description,
        };
        setTask(updatedTask);
        form?.reset(updatedTask);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await tasksApi.delete(id);
      router.push("/");
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    task,
    handleSubmit,
    handleDelete,
    isSubmitting,
    isDeleting,
  };
};
