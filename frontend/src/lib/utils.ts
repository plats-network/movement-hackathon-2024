import { clsx, type ClassValue } from "clsx"

import { toast } from "@/hooks/use-toast"
import { UseFormSetError } from "react-hook-form"

import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };

  constructor({ status, payload }: { status: number; payload?: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}




class AccessToken {
  private token = "";
  private _expiresAt = new Date().toTimeString();

  get value() {
    return this.token;
  }

  set value(token: string) {
    // neu goi method nay o server thi se bi loi
    if (typeof window === "undefined") {
      console.log("🚀 ~ sessionToken ~ setvalue ~ window:", window);

      throw new Error("Can not set token on sever side");
    }

    this.token = token;
  }

  get expiresAt() {
    return this._expiresAt;
  }

  set expiresAt(expiresAt: string) {
    // neu goi method nay o server thi se bi loi

    if (typeof window === "undefined") {
      throw new Error("Can not set token on sever side");
    }
    this._expiresAt = expiresAt;
  }
}

export const clientAccessToken = new AccessToken();