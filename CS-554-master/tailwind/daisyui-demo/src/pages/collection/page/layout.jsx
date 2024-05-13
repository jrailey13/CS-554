import Nav from "../../../components/Nav";

export default function CollectionsLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="flex h-full w-full flex-col items-center space-y-8 p-16">
        {children}
      </main>
    </>
  );
}
