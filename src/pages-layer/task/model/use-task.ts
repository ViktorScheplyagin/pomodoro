"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tasksApi } from "@/entities/task/api/tasksApi";
import type { TaskFormValues } from "@/features/task-form";
import type { TaskData } from "@/entities/task";
import { useFormContext } from "react-hook-form";
import { TaskStatus } from "@/entities/task/api/dto/task";

export const useTask = (id: string) => {
    const router = useRouter();
    const [task, setTask] = useState<TaskData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const form = useFormContext();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const taskData = await tasksApi.getById(id);
                setTask(taskData);
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

    const handleStatusChange = async (status: TaskStatus) => {
        const updatedTask = await tasksApi.update(id, { status });
        setTask(updatedTask);
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
        handleStatusChange,
        isSubmitting,
        isDeleting,
    };
};
