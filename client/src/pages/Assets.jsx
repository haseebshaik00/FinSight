import PageContainer from "../components/PageContainer";

export default function Assets() {
  return (
    <PageContainer>
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Assets Breakdown</h2>
      <p className="mb-4">Details and charts about your assets will be shown here.</p>
      <div id="assets-d3-viz">{/* Visualization */}</div>
    </PageContainer>
  );
}
