import { Inter, Noto_Sans } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });

export const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto",
})