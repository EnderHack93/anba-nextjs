import { noto } from "@/config/fonts";

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

export const Title = ({ title, subtitle, className }: Props) => {
  return (
    <div className={` ${className}`}>
      <h1
        className={`${noto.className} antialiased text-2xl sm:text-4xl font-semibold sm:mb-8 mb-5`}
      >
        {title}
      </h1>
      {subtitle && <h3 className="text-xl mb-5">{subtitle}</h3>}
    </div>
  );
};