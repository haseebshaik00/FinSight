import PageContainer from "../components/PageContainer";

export default function Home() {
  return (
    <PageContainer>
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Dashboard Overview</h2>
      <p className="mb-4">Visualizations and quick financial summaries go here.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border px-3 py-2 rounded w-full" />
        <input className="border px-3 py-2 rounded w-full" />
      </div>
    </PageContainer>
  );
}
