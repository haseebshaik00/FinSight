import PageContainer from "../components/PageContainer";

export default function Invest() {
  return (
    <PageContainer>
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Investment Plan</h2>
      <p className="mb-4">Visualizations related to personalized investment recommendations go here.</p>
      <div id="invest-d3-viz">{/* Visualization */}</div>
    </PageContainer>
  );
}
