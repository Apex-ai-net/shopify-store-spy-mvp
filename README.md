# 🕵️ Shopify Store Spy - MVP

A competitor intelligence tool for Shopify stores built with Next.js and MCPs (Model Context Protocols). This MVP demonstrates how to quickly build valuable lead-generation tools using modern web technologies and AI-powered analysis.

## 🎯 Overview

**Shopify Store Spy** analyzes any Shopify store and provides instant competitive intelligence including:
- Design & UX scoring
- Product catalog analysis  
- Pricing strategy insights
- Marketing optimization opportunities
- Actionable recommendations

Built as a lead magnet tool for **CommerceInk.com** to demonstrate technical expertise and capture qualified e-commerce leads.

## 🏗️ Architecture

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Responsive design** optimized for all devices

### Backend & MCPs
- **Puppeteer MCP** - Web scraping and data extraction
- **Memory MCP** - Competitor intelligence storage
- **n8n MCP** - Automated monitoring workflows
- **GitHub MCP** - Version control and deployment

### API Routes
- `/api/analyze` - Main competitor analysis endpoint
- `/api/mcp/puppeteer` - Web scraping integration
- `/api/mcp/memory` - Data storage and retrieval

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to MCP services

### Installation

```bash
# Clone the repository
git clone https://github.com/Apex-ai-net/shopify-store-spy-mvp.git
cd shopify-store-spy-mvp

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 MCP Integration

### Puppeteer MCP - Web Scraping
```typescript
// Extract competitor store data
const storeData = await fetch('/api/mcp/puppeteer', {
  method: 'POST',
  body: JSON.stringify({
    action: 'evaluate',
    script: `
      // Extract comprehensive store information
      const data = {
        storeName: document.title,
        productCount: document.querySelectorAll('.product-item').length,
        hasEmailCapture: !!document.querySelector('input[type=\"email\"]'),
        products: [...] // Product extraction logic
      };
      return data;
    `
  })
});
```

### Memory MCP - Intelligence Storage  
```typescript
// Store competitor analysis in knowledge graph
await fetch('/api/mcp/memory', {
  method: 'POST',
  body: JSON.stringify({
    action: 'create_entities',
    entities: [{
      name: `CompetitorStore_${storeName}`,
      entityType: 'E-commerce Store',
      observations: [
        `Overall Score: ${score}/100`,
        `Design optimizations: ${insights}`,
        // ... more intelligence data
      ]
    }]
  })
});
```

### n8n MCP - Automated Workflows
```typescript
// Setup automated competitor monitoring
const workflow = {
  trigger: \"schedule: daily 9am\",
  nodes: [
    { type: \"HTTP Request\", operation: \"analyze_competitor\" },
    { type: \"Compare\", operation: \"detect_changes\" },
    { type: \"Email\", operation: \"send_alert\", condition: \"changes_detected\" }
  ]
};
```

## 📊 Analysis Features

### Scoring Algorithm
- **Design Score** (0-100): Mobile optimization, page speed, UX elements
- **Product Score** (0-100): Catalog size, image quality, descriptions
- **Pricing Score** (0-100): Competitive pricing, discount strategies  
- **Marketing Score** (0-100): Email capture, social proof, urgency messaging

### Intelligence Insights
- ✅ **What's Working**: Successful strategies to learn from
- ⚠️ **Opportunities**: Areas where competitors are weak
- 🎯 **Actionable Items**: Specific improvements to implement

## 🎨 UI Components

### Landing Page
- Clean, conversion-focused design
- Instant URL analysis input
- Feature benefits showcase
- CommerceInk branding

### Results Dashboard  
- Circular progress score display
- Metric breakdown visualization
- Insights and opportunities cards
- Product catalog preview
- Lead capture CTA

## 📈 Business Value

### For CommerceInk
- **Lead Generation**: Captures qualified Shopify store owners
- **Authority Building**: Demonstrates technical expertise
- **Sales Tool**: Shows immediate value before consultation
- **Recurring Revenue**: Path to premium monitoring services

### For Users
- **Instant Value**: Complete analysis in 30 seconds
- **Actionable Intelligence**: Specific optimization opportunities
- **Competitive Edge**: Discover what's working for others
- **Free Analysis**: No cost barrier to entry

## 🔮 Roadmap

### Phase 1: MVP (Complete)
- [x] Basic competitor analysis
- [x] Score calculation algorithms
- [x] Responsive UI design
- [x] MCP integrations

### Phase 2: Enhanced Features
- [ ] Real Puppeteer MCP integration
- [ ] Advanced scoring algorithms
- [ ] Competitor comparison views
- [ ] Email capture and CRM integration

### Phase 3: Premium Features  
- [ ] Automated monitoring workflows
- [ ] Historical trend analysis
- [ ] API access for agencies
- [ ] White-label customization

## 🛠️ Development

### Project Structure
```
app/
├── api/
│   ├── analyze/route.ts          # Main analysis API
│   └── mcp/
│       ├── puppeteer/route.ts    # Web scraping integration
│       └── memory/route.ts       # Data storage integration
├── globals.css                   # Tailwind and custom styles
├── layout.tsx                    # App layout and metadata
└── page.tsx                      # Main frontend component
```

### Environment Variables
```bash
# Add to .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
PUPPETEER_MCP_ENDPOINT=your_puppeteer_endpoint
MEMORY_MCP_ENDPOINT=your_memory_endpoint
```

### Deployment

#### Vercel (Recommended)
```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod
```

#### Railway MCP Integration
```bash
# Use Railway MCP for automated deployment
# See railway-mcp integration in project
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CommerceInk.com** - Target client and inspiration
- **Anthropic** - Claude and MCP framework
- **Vercel** - Hosting and deployment
- **Tailwind CSS** - Styling framework

## 📞 Contact

Built by [Apex AI Solutions](https://github.com/Apex-ai-net)

For CommerceInk integration and customization:
- 📧 Email: contact@commerceink.com  
- 🌐 Website: [commerceink.com](https://commerceink.com)

---

**This MVP demonstrates how to rapidly build valuable SaaS tools using modern web technologies and MCP integrations. Perfect for agencies looking to create lead magnets and showcase technical capabilities.**