import PageContainer from "../components/PageContainer";

export default function Savings() {
  return (
    <PageContainer>
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Savings and Forecasting</h2>
      <p className="mb-4">Charts and trends based on savings go here.</p>
      <div id="savings-d3-viz">{/* Visualization */}</div>
    </PageContainer>
  );
}
