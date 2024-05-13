import Nav from "../../components/Nav";
export default function ErrorLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="flex h-full w-full flex-col items-center justify-center space-y-8 p-16">
        {children}
      </main>
    </>
  );
}
