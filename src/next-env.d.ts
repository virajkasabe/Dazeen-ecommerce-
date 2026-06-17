declare module "next/headers" {
  export function cookies(): Promise<{
    getAll(): Array<{ name: string; value: string }>;
    set(name: string, value: string, options?: any): void;
    get(name: string): { name: string; value: string } | undefined;
  }>;
}

declare module "next/server" {
  export class NextRequest {
    headers: any;
    cookies: {
      getAll(): Array<{ name: string; value: string }>;
      set(name: string, value: string): void;
    };
  }
  export class NextResponse {
    static next(options?: any): NextResponse;
    cookies: {
      set(name: string, value: string, options?: any): void;
    };
  }
}
