import CardSearch from "./components/CardSearch";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-gray-900">
      <div className="w-full max-w-2xl relative -translate-y-16">
        {/* Use the CardSearch component here */}
        <CardSearch />
      </div>
    </main>
  );
}
