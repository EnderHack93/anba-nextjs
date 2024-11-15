import withAuth from "next-auth/middleware";


export default withAuth({
    callbacks: {
      authorized: ({ token }) => {
        // Verifica si el token ha expirado
        if (!token || (token.accessTokenExpires && Date.now() > token.accessTokenExpires)) {
          return false; // Redirige al login si el token ha expirado
        }
        return true;
      },
    },
  });

export const config = {
    matcher: [
        '/estudiantes',
    ],
};
