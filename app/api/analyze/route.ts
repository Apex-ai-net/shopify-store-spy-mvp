import { NextRequest, NextResponse } from 'next/server';

interface CompetitorAnalysis {
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

export async function POST(request: NextRequest) {
  try {
    const { storeUrl } = await request.json();
    
    if (!storeUrl || !isValidShopifyUrl(storeUrl)) {
      return NextResponse.json(
        { error: 'Invalid Shopify store URL' },
        { status: 400 }
      );
    }

    console.log(`Starting analysis for: ${storeUrl}`);
    
    // Initialize analysis with Puppeteer MCP
    const analysis = await analyzeCompetitorStore(storeUrl);
    
    // Store in Memory MCP for future reference
    await storeCompetitorIntelligence(analysis);
    
    return NextResponse.json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze store. Please try again.' },
      { status: 500 }
    );
  }
}

async function analyzeCompetitorStore(storeUrl: string): Promise<CompetitorAnalysis> {
  try {
    // For MVP, we'll skip the navigation step and go directly to data extraction
    console.log(`Analyzing store: ${storeUrl}`);

    // Extract store data
    const storeData = await extractStoreData(storeUrl);
    
    // Calculate scores
    const metrics = calculateStoreMetrics(storeData);
    
    // Generate insights
    const insights = generateInsights(storeData, metrics);
    
    // Identify opportunities
    const opportunities = identifyOpportunities(storeData, metrics);

    const analysis: CompetitorAnalysis = {
      storeUrl,
      storeName: storeData.storeName || extractStoreName(storeUrl),
      overallScore: Math.round((metrics.designScore + metrics.productScore + metrics.pricingScore + metrics.marketingScore) / 4),
      metrics,
      insights,
      opportunities,
      products: storeData.products || [],
      timestamp: new Date().toISOString()
    };

    return analysis;

  } catch (error) {
    console.error('Store analysis failed:', error);
    throw error;
  }
}

async function extractStoreData(storeUrl: string) {
  try {
    // Use Puppeteer MCP to extract comprehensive store data
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://yourapp.vercel.app'; // Replace with your actual domain
    
    const extractResponse = await fetch(`${baseUrl}/api/mcp/puppeteer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'evaluate',
        script: `
          // Extract store information
          const storeData = {
            storeName: document.title || document.querySelector('h1')?.textContent,
            productCount: document.querySelectorAll('[data-product-id], .product-item, .product-card').length,
            hasEmailCapture: !!document.querySelector('input[type="email"], .email-signup, .newsletter'),
            hasReviews: !!document.querySelector('.reviews, .review, [data-reviews]'),
            hasChatWidget: !!document.querySelector('.chat-widget, #crisp-chatbox, .intercom-launcher'),
            hasUrgencyMessages: !!document.querySelector('.limited-time, .hurry, .only-left, .countdown'),
            hasGuarantees: !!document.querySelector('.guarantee, .money-back, .satisfaction'),
            socialProof: document.querySelectorAll('.testimonial, .customer-review').length,
            
            // Extract products
            products: Array.from(document.querySelectorAll('[data-product-id], .product-item, .product-card')).slice(0, 20).map(item => {
              const titleEl = item.querySelector('.product-title, .product-name, h3, h2');
              const priceEl = item.querySelector('.price, .product-price, .money');
              const imageEl = item.querySelector('img');
              const linkEl = item.querySelector('a');
              
              return {
                title: titleEl?.textContent?.trim(),
                price: priceEl?.textContent?.trim(),
                image: imageEl?.src,
                url: linkEl?.href,
                hasDiscount: !!item.querySelector('.sale, .discount, .was-price')
              };
            }).filter(p => p.title && p.price),
            
            // Design elements
            colorScheme: {
              primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#000',
              secondary: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary') || '#666'
            },
            
            // Technical analysis
            pageLoadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            hasSSL: location.protocol === 'https:',
            mobileOptimized: window.innerWidth < 768 ? 'unknown' : !!document.querySelector('meta[name="viewport"]')
          };
          
          return storeData;
        `
      })
    });

    const extractResult = await extractResponse.json();
    return extractResult.result || {};

  } catch (error) {
    console.error('Data extraction failed:', error);
    return {};
  }
}

function calculateStoreMetrics(storeData: any) {
  const designScore = calculateDesignScore(storeData);
  const productScore = calculateProductScore(storeData);
  const pricingScore = calculatePricingScore(storeData);
  const marketingScore = calculateMarketingScore(storeData);

  return {
    designScore,
    productScore,
    pricingScore,
    marketingScore
  };
}

function calculateDesignScore(data: any): number {
  let score = 0;
  
  // Mobile optimization
  if (data.mobileOptimized) score += 25;
  
  // Page load performance
  if (data.pageLoadTime && data.pageLoadTime < 3000) score += 25;
  if (data.pageLoadTime && data.pageLoadTime < 2000) score += 10;
  
  // SSL certificate
  if (data.hasSSL) score += 15;
  
  // Chat widget for support
  if (data.hasChatWidget) score += 10;
  
  // Email capture
  if (data.hasEmailCapture) score += 15;
  
  // Reviews system
  if (data.hasReviews) score += 10;
  
  return Math.min(score, 100);
}

function calculateProductScore(data: any): number {
  let score = 0;
  
  // Product variety
  if (data.productCount >= 50) score += 30;
  else if (data.productCount >= 20) score += 20;
  else if (data.productCount >= 10) score += 10;
  
  // Product data quality
  const validProducts = data.products?.filter((p: any) => p.title && p.price) || [];
  if (validProducts.length > 0) {
    const imageRatio = validProducts.filter((p: any) => p.image).length / validProducts.length;
    score += imageRatio * 30;
    
    // Discount strategy
    const discountRatio = validProducts.filter((p: any) => p.hasDiscount).length / validProducts.length;
    if (discountRatio > 0.2) score += 20;
    
    // Product descriptions (estimated)
    score += 20;
  }
  
  return Math.min(score, 100);
}

function calculatePricingScore(data: any): number {
  let score = 50; // Base score
  
  // Discount strategy presence
  const discountedProducts = data.products?.filter((p: any) => p.hasDiscount) || [];
  if (discountedProducts.length > 0) score += 20;
  
  // Pricing consistency (basic check)
  if (data.products && data.products.length > 5) score += 15;
  
  // Urgency messaging
  if (data.hasUrgencyMessages) score += 15;
  
  return Math.min(score, 100);
}

function calculateMarketingScore(data: any): number {
  let score = 0;
  
  // Email marketing
  if (data.hasEmailCapture) score += 25;
  
  // Social proof
  if (data.socialProof > 0) score += 20;
  if (data.socialProof > 5) score += 10;
  
  // Trust signals
  if (data.hasGuarantees) score += 15;
  if (data.hasReviews) score += 15;
  
  // Urgency and scarcity
  if (data.hasUrgencyMessages) score += 15;
  
  return Math.min(score, 100);
}

function generateInsights(storeData: any, metrics: any): string[] {
  const insights = [];
  
  if (metrics.designScore > 80) {
    insights.push("🎨 Excellent store design with strong user experience");
  } else if (metrics.designScore < 50) {
    insights.push("⚠️ Store design needs improvement for better conversions");
  }
  
  if (storeData.productCount > 100) {
    insights.push("📦 Large product catalog - good for SEO and customer choice");
  } else if (storeData.productCount < 20) {
    insights.push("📦 Limited product range - consider expanding catalog");
  }
  
  if (storeData.hasEmailCapture) {
    insights.push("📧 Smart email capture strategy in place");
  } else {
    insights.push("📧 Missing email capture - losing potential customers");
  }
  
  if (storeData.hasChatWidget) {
    insights.push("💬 Live chat support enhances customer service");
  }
  
  if (storeData.hasUrgencyMessages) {
    insights.push("⏰ Using urgency messaging to drive conversions");
  }
  
  return insights;
}

function identifyOpportunities(storeData: any, metrics: any): string[] {
  const opportunities = [];
  
  if (!storeData.hasEmailCapture) {
    opportunities.push("Add email popup to capture 15-25% more leads");
  }
  
  if (!storeData.hasChatWidget) {
    opportunities.push("Install live chat to increase conversion by 12%");
  }
  
  if (!storeData.hasGuarantees) {
    opportunities.push("Add money-back guarantee to reduce purchase hesitation");
  }
  
  if (storeData.socialProof < 3) {
    opportunities.push("Display more customer testimonials and reviews");
  }
  
  if (!storeData.hasUrgencyMessages) {
    opportunities.push("Add urgency messaging (limited time offers, stock counters)");
  }
  
  if (metrics.designScore < 70) {
    opportunities.push("Improve page load speed and mobile optimization");
  }
  
  const discountRatio = storeData.products?.filter((p: any) => p.hasDiscount).length / (storeData.products?.length || 1);
  if (discountRatio < 0.1) {
    opportunities.push("Consider strategic discounting to increase average order value");
  }
  
  return opportunities;
}

async function storeCompetitorIntelligence(analysis: CompetitorAnalysis) {
  try {
    // Store analysis in Memory MCP for future reference
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://yourapp.vercel.app'; // Replace with your actual domain
    
    const memoryResponse = await fetch(`${baseUrl}/api/mcp/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_entities',
        entities: [{
          name: `CompetitorStore_${analysis.storeName?.replace(/\s+/g, '_')}`,
          entityType: 'E-commerce Store',
          observations: [
            `Overall Score: ${analysis.overallScore}/100`,
            `Design Score: ${analysis.metrics.designScore}/100`,
            `Product Score: ${analysis.metrics.productScore}/100`,
            `Pricing Score: ${analysis.metrics.pricingScore}/100`,
            `Marketing Score: ${analysis.metrics.marketingScore}/100`,
            `Analyzed: ${analysis.timestamp}`,
            `URL: ${analysis.storeUrl}`,
            `Product Count: ${analysis.products.length}`,
            ...analysis.insights,
            ...analysis.opportunities
          ]
        }]
      })
    });

    if (!memoryResponse.ok) {
      console.warn('Failed to store in memory:', await memoryResponse.text());
    }

  } catch (error) {
    console.warn('Memory storage failed:', error);
    // Don't fail the main analysis if memory storage fails
  }
}

function isValidShopifyUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Check for .myshopify.com domains (official Shopify stores)
    if (urlObj.hostname.includes('myshopify.com')) {
      return true;
    }
    
    // Check for custom domains that might be Shopify stores
    if (urlObj.hostname.includes('.com') || 
        urlObj.hostname.includes('.store') || 
        urlObj.hostname.includes('.shop') ||
        urlObj.hostname.includes('.co')) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

function extractStoreName(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('.myshopify.com', '').replace('www.', '');
  } catch {
    return 'Unknown Store';
  }
}