"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";

const formSchema = z.object({
  userId: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const RegisterIdForm = () => {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // setIsOpen(false); // Close the modal after successful form submission.
    router.push("/id-management"); // Redirect to dashboard page after successful form submission.
  }
  return (
    <div className="w-full h-full text-center flex flex-col gap-[120px] items-center justify-center ">
       <p className="text-[28px] font-semibold">
                  Register your ID <br />
                  to start your journey
                </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
       
               
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="text-start">
                
                <FormControl>
                  <div className="relative">
                    <input
                      {...field}
                      className="block w-full py-[18px] px-3  focus:ring-0  border border-[#EAEAEA] rounded-lg bg-transparent  text-white text-base"
                      placeholder="Input text"
                    />
                    <p className="text-gray-600 absolute end-2.5 bottom-2.5  font-medium rounded-lg text-sm px-4 py-2 ">
                      .ID
                    </p>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit"  className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7] rounded-xl w-full py-4 text-base font-bold text-center text-white cursor-pointer">
          CLAM ID
          </button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterIdForm;
