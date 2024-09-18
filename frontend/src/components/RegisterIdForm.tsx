"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import authApiRequest from "@/apiRequest/auth";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  platId: z.string().min(2, {
    message: "platId must be at least 2 characters.",
  }),
});

const RegisterIdForm = ({ authenToken }: { authenToken: string }) => {
  const router = useRouter();

  const { publicKey } = useWallet();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platId: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    handleRegister(values.platId);
  }

  const handleRegister = async (platId: string) => {
    try {
      if (!authenToken) return;
      if (!publicKey) return;

      const data = {
        eoa: publicKey?.toBase58(),
        plat_id: platId,
        public_key: Buffer.from(publicKey.toBytes()).toString("base64"),
      };

      const response = await authApiRequest.register(data, authenToken);

      toast({
        className: "z-50 text-white",
        description: response.data.msg,
      });
      if (response) {
        const responseLogin = await authApiRequest.login(authenToken);
        toast({
          className: "z-50 text-white",
          description: responseLogin.data.msg,
        });

        await authApiRequest.auth({
          accessToken: responseLogin.data.data.access_token,
        });
        router.push("/id-management");
      }
    } catch (error) {}
  };

  return (
    <div className="w-full h-full text-center flex flex-col gap-[120px] items-center justify-center ">
      <p className="text-[28px] font-semibold">
        Register your ID <br />
        to start your journey
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="platId"
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
          <button
            type="submit"
            className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7] rounded-xl w-full py-4 text-base font-bold text-center text-white cursor-pointer"
          >
            CLAM ID
          </button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterIdForm;
