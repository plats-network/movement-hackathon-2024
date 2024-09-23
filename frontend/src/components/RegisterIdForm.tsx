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
import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";



const formSchema = z.object({
  platId: z.string().min(2, {
    message: "platId must be at least 2 characters.",
  }),
});

const RegisterIdForm = ({ authenToken }: { authenToken: string }) => {
  const router = useRouter();

  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setIsLoading(true)
      if (!authenToken) return;
      if (!publicKey) return;
      
      const data = {
        eoa: publicKey?.toBase58(),
        plat_id: platId+".ID",
        public_key: Buffer.from(publicKey.toBytes()).toString("base64"),
      };

      const response = await authApiRequest.register(data, authenToken);

      toast({
        className: "z-50 text-white",
        description: response.payload.msg,
      });
      if (response) {
        const responseLogin = await authApiRequest.login(authenToken);
        console.log("🚀 ~ handleRegister ~ responseLogin:", responseLogin)
     

        await authApiRequest.auth({
          accessToken: responseLogin.payload.data.access_token,
        });
        toast({
          className: "z-50 text-white",
          description: "Login successful",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setIsLoading(false)
      console.log("🚀 ~ handleRegister ~ error:", error)
      toast({
        variant: "destructive",
        className:"z-50 text-white",
        description: "Connect wallet failed",
      });
      
    } 
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
          <LoadingButton
          loading={isLoading}
          disabled={isLoading}
            type="submit"
            className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7] rounded-xl w-full h-[56px] py-4 text-base font-bold text-center text-white cursor-pointer"
          >
            CLAM ID
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default RegisterIdForm;
