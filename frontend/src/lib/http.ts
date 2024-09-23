
import { normalizePath } from "@/lib/utils";
// import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 400;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

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

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;

  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    if (status !== ENTITY_ERROR_STATUS) {
      throw new Error("Invalid status code for EntityError");
    }
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

let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body
    ? options?.body instanceof FormData
      ? options.body
      : JSON.stringify(options?.body)
    : undefined;

  const baseHeaders =
    options?.body instanceof FormData
      ? {
          Authorization: clientAccessToken.value
            ? `Bearer ${clientAccessToken.value}`
            : "",
        }
      : {
          "Content-Type": "application/json",
          Authorization: clientAccessToken.value
            ? `Bearer ${clientAccessToken.value}`
            : "",
        };

  // Neu khong truyen baseurl hoac baseurl = undefine thi lay tu envconfig
  // neu truyn vao baeUrl thi lay gia tri truyen vao, neu truyen vao '' thi dong nghia chung ta goi api den nextjs server
  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API
      : options?.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  const payload: any = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  //Interceptor la noi chung ta xu ly request va response truoc khi tra ve cho phia component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== "undefined") {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            } as any,
          });
          await clientLogoutRequest;
          clientAccessToken.value = "";
          clientLogoutRequest = null;
          location.href = "/login";
      
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  //dam bao chi chay o client
  if (typeof window !== "undefined") {
    if (
      ["auth/login"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      clientAccessToken.value = (payload as any).data?.access_token; 
    } else if ("auth/logout" === normalizePath(url)) {
      clientAccessToken.value = "";
    }
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },

  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },

  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },

  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
