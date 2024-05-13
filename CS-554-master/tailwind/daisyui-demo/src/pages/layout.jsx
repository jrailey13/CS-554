import Nav from "../components/Nav";

export default function HomeLayout({ children }) {
  return (
    <div className="flex flex-col">
      <Nav />
      <main className="flex h-screen w-full flex-grow flex-col items-center space-y-8 p-16">
        {children}
      </main>
    </div>
  );
}
