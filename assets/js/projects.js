const projects = [
    {
        id: 'obsidian-mcp',
        title: 'obsidian mcp',
        type: 'tool',
        about: 'MCP server bridging Claude AI with an Obsidian knowledge vault — 7 tools for note creation, search, bidirectional linking, AI classification, and daily note atomization',
        highlights: [
            '263 conversations imported, zero duplicates',
            '7 tools, 4 dependencies',
            'AI classification with heuristic fallback',
            'Idempotent import pipeline with source_id deduplication',
            'Dev/prod vault separation with full promote pipeline'
        ],
        stack: ['TypeScript', 'MCP SDK', 'Anthropic API', 'Node.js'],
        date: '2026',
        tags: ['ai', 'mcp', 'pkm', 'developer-tools'],
        link: '#',
        color: '#5B21B6'
    },
    {
        id: 'classifier',
        title: 'classifier',
        type: 'tool',
        about: 'AI-powered document classification pipeline',
        highlights: ['TBD'],
        stack: ['TBD'],
        date: '2025',
        tags: ['ai', 'automation'],
        link: '#',
        color: '#005A9C'
    },
    {
        id: 'chair-roundtable',
        title: 'chair roundtable',
        type: 'document',
        about: 'First-principles design conversation with Thonet, Eames, Wegner, Prouve, Rietveld, Morrison',
        excerpt: 'What makes a great chair? Six legendary designers argue about ergonomics, materials, cost, and craft — applied to real constraints: a NYC apartment, a toddler, and a Japanese handsaw.',
        body: '<blockquote>A fictional roundtable with Michael Thonet, Gerrit Rietveld, Charles Eames, Hans Wegner, Jean Prouve, and Jasper Morrison. The mission: make quality housing and furniture available to all.</blockquote>'
            + '<div class="drawer-body-content">'
            + '<p><strong>Thonet:</strong> &ldquo;Are you designing for the approval of other designers, or for the person who comes home exhausted? You cannot do both.&rdquo;</p>'
            + '<p><strong>Wegner:</strong> &ldquo;A cushion is not design — a cushion is an apology.&rdquo;</p>'
            + '<p><strong>Morrison:</strong> &ldquo;If you\'re not embarrassed by how crude the prototype looks, you spent too long on it.&rdquo;</p>'
            + '<p style="margin-top:1.5rem;"><a href="/chair-roundtable.html" target="_blank" rel="noopener" style="color:#1a1a1a; border-bottom:1px solid #999; text-decoration:none; font-size:0.85rem;">Read the full conversation &rarr;</a></p>'
            + '</div>',
        stack: [],
        date: '2026',
        tags: ['design', 'craft', 'first-principles'],
        link: '#',
        color: '#6B4F10'
    },
    {
        id: 'blog',
        title: 'blog',
        type: 'document',
        about: 'braindump',
        excerpt: 'Thinking out loud about building with AI, product craft, and the tools that shape how we work.',
        stack: [],
        date: '2025',
        tags: ['writing'],
        link: '#',
        color: '#1F6B42'
    },
    {
        id: 'research-agent',
        title: 'research agent',
        type: 'tool',
        about: 'Contextualize Claude chat history into a searchable knowledge base',
        highlights: ['Conversation parsing', 'Auto-tagging', 'Semantic search'],
        stack: ['TypeScript', 'Claude API'],
        date: '2025',
        tags: ['ai', 'research'],
        link: '#',
        color: '#FF4433'
    }
];
