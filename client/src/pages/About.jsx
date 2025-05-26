import PageContainer from "../components/PageContainer";

export default function About() {
  return (
    <PageContainer>
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">About FinSight</h2>
      <p className="mb-4">
        This platform helps track expenses, analyze savings, and generate investment plans through interactive data visualizations.
      </p>
      <ul className="list-disc pl-6">
        <li>Built with React, Vite, Tailwind CSS</li>
        <li>Visualizations powered by D3.js</li>
        <li>Backend powered by Node.js</li>
        <li>Modules: Dashboard, Savings Forecast, Asset Tracker, Investment Strategy</li>
      </ul>
    </PageContainer>
  );
}
