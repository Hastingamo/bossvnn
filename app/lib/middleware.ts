// import { createServerClient } from "@supabase/ssr";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({ request });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             request.cookies.set(name, value);
//             response.cookies.set(name, value, options);
//           });
//         },
//       },
//     }
//   );

//   const { data: { user } } = await supabase.auth.getUser();

//   console.log("Middleware user:", user?.email); // debug line

//   const protectedRoutes = ["/Exchanges", "/Profile", "/admin"];
//   const isProtected = protectedRoutes.some((route) =>
//     request.nextUrl.pathname.startsWith(route)
//   );

//   if (isProtected && !user) {
//     return NextResponse.redirect(new URL("/SignUp", request.url));
//   }

//   return response;
// }