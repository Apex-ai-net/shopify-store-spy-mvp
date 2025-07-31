import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, entities, query } = await request.json();
    
    switch (action) {
      case 'create_entities':
        return await handleCreateEntities(entities);
      case 'search_nodes':
        return await handleSearchNodes(query);
      case 'read_graph':
        return await handleReadGraph();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Memory MCP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCreateEntities(entities: any[]) {
  try {
    // This would normally store entities in Memory MCP
    // For MVP, we'll simulate storage in a simple in-memory store
    console.log('Storing entities:', entities.map(e => e.name));
    
    // Simulate storage delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Store in a simple JSON structure (in production this would be persistent)
    const timestamp = new Date().toISOString();
    const storedEntities = entities.map(entity => ({
      ...entity,
      id: generateId(),
      createdAt: timestamp,
      updatedAt: timestamp
    }));
    
    return NextResponse.json({ 
      success: true, 
      stored: storedEntities.length,
      entities: storedEntities
    });
  } catch (error) {
    throw new Error(`Entity creation failed: ${error}`);
  }
}

async function handleSearchNodes(query: string) {
  try {
    // This would normally search the Memory MCP knowledge graph
    // For MVP, we'll return mock search results
    console.log('Searching for:', query);
    
    const mockResults = [
      {
        id: 'comp_001',
        name: 'CompetitorStore_TechGadgets',
        entityType: 'E-commerce Store',
        observations: [
          'Overall Score: 87/100',
          'Strong mobile optimization',
          'Excellent product photography',
          'Uses urgency messaging effectively'
        ],
        relevanceScore: 0.95
      },
      {
        id: 'comp_002', 
        name: 'CompetitorStore_ElectronicsHub',
        entityType: 'E-commerce Store',
        observations: [
          'Overall Score: 72/100',
          'Good pricing strategy',
          'Limited email capture',
          'Strong social proof'
        ],
        relevanceScore: 0.78
      }
    ];
    
    return NextResponse.json({ 
      success: true, 
      results: mockResults.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.observations.some(obs => obs.toLowerCase().includes(query.toLowerCase()))
      )
    });
  } catch (error) {
    throw new Error(`Search failed: ${error}`);
  }
}

async function handleReadGraph() {
  try {
    // This would normally return the entire knowledge graph from Memory MCP
    // For MVP, we'll return a simplified graph structure
    console.log('Reading knowledge graph...');
    
    const mockGraph = {
      entities: [
        {
          id: 'comp_001',
          name: 'CompetitorStore_TechGadgets',
          entityType: 'E-commerce Store',
          observations: [
            'Overall Score: 87/100',
            'Design Score: 91/100',
            'Product Score: 85/100',
            'Marketing Score: 88/100',
            'Uses Shopify Plus',
            'Strong email marketing strategy',
            'High-quality product photography'
          ]
        },
        {
          id: 'comp_002',
          name: 'CompetitorStore_ElectronicsHub', 
          entityType: 'E-commerce Store',
          observations: [
            'Overall Score: 72/100',
            'Design Score: 68/100',
            'Product Score: 78/100',
            'Marketing Score: 70/100',
            'Standard Shopify plan',
            'Limited social proof'
          ]
        }
      ],
      relations: [
        {
          from: 'comp_001',
          to: 'ProductCategory_Electronics',
          relationType: 'specializes_in'
        },
        {
          from: 'comp_002',
          to: 'ProductCategory_Electronics',
          relationType: 'specializes_in'
        }
      ],
      statistics: {
        totalEntities: 2,
        totalRelations: 2,
        lastUpdated: new Date().toISOString()
      }
    };
    
    return NextResponse.json({ 
      success: true, 
      graph: mockGraph 
    });
  } catch (error) {
    throw new Error(`Graph read failed: ${error}`);
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}