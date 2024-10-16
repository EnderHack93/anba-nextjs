import { Sidebar, TopMenu } from "@/components";

export default function mainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen max-h-screen flex flex-col flex-grow overflow-hidden">
      <TopMenu />
      <Sidebar />
      <div className=" px-0 sm:px-5 bg-gray-200 justify-center h-full overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </main>
  );
}
