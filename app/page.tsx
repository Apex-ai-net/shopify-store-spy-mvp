'use client';

import { useState } from 'react';
import { Search, TrendingUp, Eye, Target, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AnalysisResult {
  storeUrl: string;
  storeName: string;
  overallScore: number;
  metrics: {
    designScore: number;
    productScore: number;
    pricingScore: number;
    marketingScore: number;
  };
  insights: string[];
  opportunities: string[];
  products: any[];
  timestamp: string;
}

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a store URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeUrl: url.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Shopify Store Spy</h1>
                <p className="text-sm text-gray-500">by CommerceInk</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Competitor Intelligence Tool
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          /* Landing Section */
          <div className="text-center mb-12">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Uncover Your Competitors' Secrets
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get instant competitive intelligence on any Shopify store. 
                Discover their strategies, pricing, and optimization opportunities in under 30 seconds.
              </p>
            </div>

            {/* URL Input */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter competitor's Shopify store URL (e.g., store.myshopify.com)"
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Clock className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="h-5 w-5" />
                      Analyze Store
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-600 mt-3 text-sm">{error}</p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Performance Analysis</h3>
                <p className="text-gray-600 text-sm">Comprehensive scoring across design, products, pricing, and marketing</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Actionable Insights</h3>
                <p className="text-gray-600 text-sm">Specific recommendations to outperform your competition</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-gray-600 text-sm">Complete competitive analysis delivered in under 30 seconds</p>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Header Results */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{result.storeName}</h2>
                  <p className="text-gray-500">{result.storeUrl}</p>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Analyze Another Store
                </button>
              </div>

              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBg(result.overallScore)} mb-4`}>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}
                    </div>
                    <div className="text-sm text-gray-600">/ 100</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Overall Store Score</h3>
              </div>

              {/* Metric Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(result.metrics.designScore)} mb-1`}>
                    {result.metrics.designScore}
                  </div>
                  <div className="text-sm text-gray-600">Design & UX</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(result.metrics.productScore)} mb-1`}>
                    {result.metrics.productScore}
                  </div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(result.metrics.pricingScore)} mb-1`}>
                    {result.metrics.pricingScore}
                  </div>
                  <div className="text-sm text-gray-600">Pricing</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(result.metrics.marketingScore)} mb-1`}>
                    {result.metrics.marketingScore}
                  </div>
                  <div className="text-sm text-gray-600">Marketing</div>
                </div>
              </div>
            </div>

            {/* Insights and Opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Key Insights */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Key Insights
                </h3>
                <div className="space-y-3">
                  {result.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Opportunities
                </h3>
                <div className="space-y-3">
                  {result.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{opportunity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Preview */}
            {result.products.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Products Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {result.products.slice(0, 5).map((product, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}
                      <h4 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">{product.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-600">{product.price}</span>
                        {product.hasDiscount && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Sale</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Implement These Insights?</h3>
              <p className="text-lg mb-6 opacity-90">
                Get professional help from CommerceInk to implement these competitive strategies and boost your conversions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Schedule Free Consultation
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Learn More About CommerceInk
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Shopify Store Spy</span>
          </div>
          <p className="text-gray-400 mb-4">
            Professional competitor intelligence tool by CommerceInk.com
          </p>
          <p className="text-sm text-gray-500">
            © 2024 CommerceInk. All rights reserved. Built with Next.js and MCPs.
          </p>
        </div>
      </footer>
    </div>
  );
}