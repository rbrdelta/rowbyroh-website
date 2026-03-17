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
        color: '#7C3AED'
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
        body: '<p class="drawer-premise">Interactive discussion with Michael Thonet, Gerrit Rietveld, Charles Eames, Hans Wegner, Jean Prouve, Jasper Morrison. Purpose: learn first principles of chair design from history\'s greatest chair makers.</p>'
            + '<h3>Why the Chair</h3>'
            + '<p>Sitting implies intent — to eat, converse, relax, read. It is the primary mode of modern life. The chair is the first piece of furniture we touch in most environments. Quality = thoughtfulness in design, respect for material, care in craftsmanship. The culmination of intent at every step.</p>'
            + '<h4>Cost / Price / Value <span class="drawer-speaker">Eames</span></h4>'
            + '<p><strong>Cost</strong> (what maker pays) &rarr; <strong>Price</strong> (what buyer pays) &rarr; <strong>Value</strong> (what sitter receives over lifetime). Collapse these three toward each other. Divergence = exploitation or design failure.</p>'
            + '<h4>Morrison Warning</h4>'
            + '<p>Quality that creates artificial scarcity is not quality — it\'s marketing. The Air Chair costs little, is everywhere, and works. Satisfaction through rightness, not desire through scarcity.</p>'
            + '<h4>Thonet\'s Choice</h4>'
            + '<p>Are you designing for approval of other designers, or for the person who comes home exhausted? You cannot do both.</p>'
            + '<h3>Ergonomics — Three Critical Angles <span class="drawer-speaker">Prouve</span></h3>'
            + '<p>The hip angle is the master variable. Everything cascades from it.</p>'
            + '<ol><li><strong>Seat pan tilt</strong>: 0-5&deg; task, up to 15&deg; lounge</li>'
            + '<li><strong>Back angle relative to seat</strong>: 90-95&deg; dining, 100-110&deg; relaxed, beyond = recliner</li>'
            + '<li><strong>Seat height vs. popliteal height</strong>: Off by 2cm = pressure behind thighs, sitter leaves in 20 min</li></ol>'
            + '<p><span class="drawer-speaker">Wegner</span>: Engaged hips = thighs slope down, torso-thigh ~90-100&deg;. Relaxed hips = angle opens to 105-120&deg;.</p>'
            + '<p><span class="drawer-speaker">Morrison</span>: Don\'t ask how much support to add. Ask what is the minimum structure that lets the body find its own comfort.</p>'
            + '<h3>Lounge vs Dining — The Modern Condition</h3>'
            + '<p>I chose lounge first. More people live alone, coffee table as primary surface, dining table as office. Design must serve personal and professional in digitally engaged world.</p>'
            + '<p><span class="drawer-speaker">Eames</span>: A lounge trying to be a dining chair fails at both. Design systems — one shape, different bases.</p>'
            + '<p><span class="drawer-speaker">Morrison on the Poang</span>: One of the most important chairs of 50 years. Cantilevered flex, ships flat, bent laminated birch. Super Normal whether IKEA intended it or not.</p>'
            + '<p><span class="drawer-speaker">Wegner</span>: &ldquo;A cushion is not design — a cushion is an apology.&rdquo;</p>'
            + '<h3>Materials — Pine, Structure vs Surface</h3>'
            + '<p>Pine for prototyping (cheap, forgiving, esp. southern yellow pine). Oak or ash for production (durable, generational). Pine = values statement about access over prestige.</p>'
            + '<p><strong>Seat construction</strong>: Laminate two boards on edge, grain front to back. Saddle ~1/4&rdquo; back to 3/8&rdquo; front. Keep front stretcher for compression strength.</p>'
            + '<p><span class="drawer-speaker">Prouve</span>: Vision without a supply chain is just philosophy. You must be inventor AND supply chain architect.</p>'
            + '<h3>Prototyping Under Constraint</h3>'
            + '<p>Tools: Japanese handsaw, vintage Stanley jack plane. No workbench. NYC apartment, toddler, late nights only.</p>'
            + '<h4>Eames Process</h4>'
            + '<ol><li><strong>Sketch</strong> to discover (30 seconds, tests if idea has life)</li>'
            + '<li><strong>Model</strong> to test (rough, fast, ugly)</li>'
            + '<li><strong>Engineer</strong> to produce (only third)</li></ol>'
            + '<p>Never reverse this order. CAD optimizes before you discover.</p>'
            + '<h4>Prouve\'s Force Skeleton Method</h4>'
            + '<ol><li>Cut side profile from double-wall cardboard</li>'
            + '<li>Two profiles, connect with cross pieces at seat and rail heights</li>'
            + '<li>Sit in it — where it collapses = force concentration points</li>'
            + '<li>Reinforce, sit again, find next failure</li>'
            + '<li>Costs nothing. Midnight, living room floor.</li></ol>'
            + '<h4>Morrison on Prototypes</h4>'
            + '<p>&ldquo;Each prototype answers exactly ONE question. Trying to answer five = learning nothing from failure. If you\'re not embarrassed by how crude it looks, you spent too long on it.&rdquo;</p>'
            + '<h3>Assignment from the Table</h3>'
            + '<p>Build a seat (not a full chair) from cardboard. Target: 16-18&rdquo; wide, 15-17&rdquo; deep, 12-15&rdquo; high. Laminate 3-4 cardboard layers, alternating flute directions. Sit test with eyes closed, mark pressure points with pen.</p>'
            + '<p><span class="drawer-speaker">Prouve</span>: Coffee table = 16-18&rdquo; high. Seat must be at or slightly above table surface = 12-15&rdquo; seat height. This is between dining and lounge. It doesn\'t exist yet.</p>',
        stack: [],
        date: '2026',
        tags: ['design', 'craft', 'first-principles'],
        link: '#',
        color: '#8B6914'
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
        color: '#2E8B57'
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
