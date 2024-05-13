export default function Card({ children }) {
  return (
    <div className="flex flex-col justify-between bg-gray-600 p-8">
      {children}
    </div>
  );
}
