"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    title: z.string().min(1, { message: "Job Title cannot be empty" }),
});

const JobCreatePage = () => {
    // const [isLoading, setisLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const {isSubmitting, isValid }= form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            {/* Common Container for Alignment */}
            <div className="w-full max-w-lg space-y-6">
                {/* Section: Name your Job */}
                <div>
                    <h1 className="text-2xl font-medium">Name your job</h1>
                    <p className="text-sm text-neutral-500 mt-2 pb-5">
                        What would you like to name your job? Don&apos;t worry, you can
                        change this later.
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Form Field */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        {/* Job Title */}
                                        <FormLabel className="text-base font-medium">
                                            Job Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Full-Stack Developer'"
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* Role Description */}
                                        <FormDescription className="text-sm text-neutral-500">
                                            Role of this job
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                );
                            }}
                        ></FormField>

                        {/* Buttons */}
                        <div className="flex items-center gap-x-2">
                            <Link href={"/"}>
                                <Button type="button" variant={"ghost"}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default JobCreatePage;
