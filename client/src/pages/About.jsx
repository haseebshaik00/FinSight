import PageContainer from "../components/PageContainer";

export default function About() {
  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-4 mb-3">
      <PageContainer>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">About FinSight</h2>
        <p className="mb-4">
          <strong>FinSight</strong> is a smart, personalized financial analytics platform designed to help everyday users—
          especially students and early-career professionals—track their expenses, forecast savings, and generate data-driven
          investment plans without needing financial expertise.
        </p>

        <p className="mb-4">
          Built using a scalable <strong>MERN (MongoDB, Express, React, Node.js)</strong> + <strong>FastAPI</strong> architecture, FinSight integrates:
        </p>

        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>💡 <strong>Attention-based LSTM models</strong> to forecast short-term asset returns</li>
          <li>📊 <strong>Markowitz portfolio optimization</strong> to allocate savings across major asset classes (Stocks, Mutual Funds, Crypto, Bonds, Gold)</li>
          <li>🔁 <strong>Return-amplified intra-class distribution</strong> to select the top assets within each class based on predicted performance</li>
        </ul>

        <p className="mb-4">
          With over <strong>270,000 data points</strong> sourced from Yahoo Finance and FRED API, FinSight provides robust, real-world forecasting and allocation grounded in historical trends.
        </p>

        <p className="mb-4">The platform’s interactive dashboards—built with D3.js and Tailwind CSS—enable users to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Visualize income, expenses, and savings trends over time</li>
          <li>Receive AI-powered savings advice</li>
          <li>Explore personalized investment breakdowns using TreeMaps and Donut Charts</li>
        </ul>

        <p className="mb-4">
          A key focus of FinSight is <strong>interpretability and accessibility</strong>: every model output is translated into visual,
          user-friendly insights. Evaluations showed that over <strong>90% of users</strong> trusted the forecasts, and <strong>70%</strong> felt
          the investment suggestions aligned with their risk preferences.
        </p>

        <p className="mb-4">
          FinSight bridges the gap between intelligent automation and human-centered financial planning—empowering users to make
          confident, informed decisions about their financial future.
        </p>
      </PageContainer>
    </div>
  );
}
