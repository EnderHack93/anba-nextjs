import { DecodedToken } from "@/interfaces/auth/token/decoded-token";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { decodeJwt } from "jose";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  debug:true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: {
          label: "correo",
          type: "email",
          placeholder: "test@test.com",
        },
        password: { label: "Password", type: "password" },
        remember: {
          label: "Recordarme",
          type: "checkbox",
        },
      },
      async authorize(credentials) {
        const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;
        const remember = credentials?.remember === "true" ? true : false;
        const res = await fetch(`${url_base}auth/login`, {
          method: "POST",
          body: JSON.stringify({
            correo: credentials?.correo,
            password: credentials?.password,
            remember: remember,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        if (user.accessToken && user.refreshToken) {
          return user;
        } else {
          if (user.message) throw user;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Si el usuario se autenticó, inicializa el token
      const MARGIN_TIME = 30 * 1000
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;

        // Decodifica el accessToken para obtener la fecha de expiración
        const decodedToken: DecodedToken = decodeJwt(user.accessToken);
        token.accessTokenExpires = decodedToken.exp * 1000; // Convierte a ms
        token.email = decodedToken.email;
        token.id = decodedToken.id;
        token.rol = decodedToken.rol;
      }

      // Si el token expira, intenta renovarlo
      if (Date.now() > token.accessTokenExpires - MARGIN_TIME) {
        const refreshedToken = await refreshAccessToken(token);
        if (refreshedToken.error) {
          token.error = refreshedToken.error;
        } else {
          token = refreshedToken;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Ajustar la sesión para que coincida con la duración del accessToken
      session.user = {
        email: token.email,
        rol: token.rol,
        id: token.id,
        accessToken: token.accessToken,
      };

      // Establece la expiración de la sesión igual a la expiración del token
      session.expires = new Date(token.accessTokenExpires).toUTCString();

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
});
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url_base = process.env.NEXT_PUBLIC_URL_BACKEND;
    const res = await fetch(`${url_base}auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshedToken = await res.json();

    if (!res.ok) {
      throw new Error("Error al renovar el token");
    }

    const decodedToken = decodeJwt(refreshedToken.accessToken);

    if (decodedToken.exp) {
      const newExpirationTime = decodedToken.exp * 1000;

      return {
        email: decodedToken.email as string,
        id: decodedToken.id as string,
        rol: decodedToken.rol as string,
        iat: decodedToken.iat,
        exp:decodedToken.exp,       
        accessToken: refreshedToken.accessToken,
        accessTokenExpires: newExpirationTime,
        refreshToken: token.refreshToken,
      };
    }else{
      return { ...token, error: "RefreshAccessTokenError" };
    }
  } catch (error) {
    console.error("Error al renovar el token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export { handler as GET, handler as POST };
