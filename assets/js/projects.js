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
        body: '<blockquote>A fictional roundtable with Michael Thonet, Gerrit Rietveld, Charles Eames, Hans Wegner, Jean Prouve, and Jasper Morrison. The mission: make quality housing and furniture available to all.</blockquote>'

            + '<h3>Why the Chair</h3>'

            + '<p class="voice-me">Humans have five primary biomechanical modalities — stand, walk, lay, climb, and sit. Of the five, sitting implies intent. To eat, converse, relax, read. It\'s the primary mode of modern life. The chair is the first piece of furniture we touch in most environments we visit. So what makes one truly great?</p>'

            + '<div class="voice-designer"><span class="designer-name">Eames</span>'
            + 'You\'re asking about value. There are three things people confuse. <strong>Cost</strong> — what the maker pays. <strong>Price</strong> — what the buyer pays. <strong>Value</strong> — what the sitter receives over a lifetime. The goal is to collapse these three toward each other. When they diverge, that\'s either exploitation or design failure.</div>'

            + '<div class="voice-designer"><span class="designer-name">Morrison</span>'
            + 'Quality that creates artificial scarcity is not quality — it\'s marketing. My Air Chair costs little, is everywhere, and works. Satisfaction through rightness, not desire through scarcity.</div>'

            + '<div class="voice-designer"><span class="designer-name">Thonet</span>'
            + 'Answer me this: are you designing for the approval of other designers, or for the person who comes home exhausted? You cannot do both.</div>'

            + '<hr>'

            + '<h3>Ergonomics — Three Critical Angles</h3>'

            + '<div class="voice-designer"><span class="designer-name">Prouve</span>'
            + 'The hip angle is the master variable. Everything cascades from it.'
            + '<ol><li><strong>Seat pan tilt</strong> — 0-5&deg; for task, up to 15&deg; for lounge</li>'
            + '<li><strong>Back angle relative to seat</strong> — 90-95&deg; dining, 100-110&deg; relaxed, beyond that is a recliner</li>'
            + '<li><strong>Seat height vs. popliteal height</strong> — off by 2cm and there\'s pressure behind the thighs. The sitter leaves in 20 minutes.</li></ol></div>'

            + '<div class="voice-designer"><span class="designer-name">Wegner</span>'
            + 'Engaged hips — thighs slope down, torso-thigh angle around 90-100&deg;. Relaxed hips — the angle opens to 105-120&deg;. You must decide which you\'re designing for before you cut wood.</div>'

            + '<div class="voice-designer"><span class="designer-name">Morrison</span>'
            + 'Don\'t ask how much support to add. Ask: what is the minimum structure that lets the body find its own comfort?</div>'

            + '<hr>'

            + '<h3>Lounge vs Dining</h3>'

            + '<p class="voice-me">I chose lounge first. More people live alone. The coffee table is the primary surface now. The dining table is an office. Whatever I design has to serve both personal and professional life in a digitally engaged world.</p>'

            + '<div class="voice-designer"><span class="designer-name">Eames</span>'
            + 'Careful. A lounge trying to be a dining chair fails at both. Better to design a system — one shape, different bases.</div>'

            + '<div class="voice-designer"><span class="designer-name">Morrison</span>'
            + 'The IKEA Poang is one of the most important chairs of the last fifty years. Cantilevered flex, ships flat, bent laminated birch. It\'s Super Normal whether IKEA intended it or not.</div>'

            + '<div class="voice-designer"><span class="designer-name">Wegner</span>'
            + '&ldquo;A cushion is not design — a cushion is an apology.&rdquo;</div>'

            + '<hr>'

            + '<h3>Materials</h3>'

            + '<p class="voice-me">I\'m starting with pine. Southern yellow pine specifically. It\'s cheap, forgiving, available everywhere. Oak or ash for production eventually — durable, generational. But pine is a values statement: access over prestige.</p>'

            + '<div class="voice-designer"><span class="designer-name">Prouve</span>'
            + 'Good instinct, but a warning: vision without a supply chain is just philosophy. You must be inventor AND supply chain architect.</div>'

            + '<p class="voice-me">For the seat: laminate two boards on edge, grain running front to back. Saddle it — about 1/4&Prime; in the back deepening to 3/8&Prime; at the front. Keep the front stretcher for compression strength.</p>'

            + '<hr>'

            + '<h3>Prototyping Under Constraint</h3>'

            + '<p class="voice-me">My tools: a Japanese handsaw and a vintage Stanley jack plane. No workbench. I\'m in a NYC apartment with a toddler. I work late nights only.</p>'

            + '<div class="voice-designer"><span class="designer-name">Eames</span>'
            + 'Good. Here\'s the order. First, <strong>sketch</strong> to discover — 30 seconds, just test if the idea has life. Second, <strong>model</strong> to test — rough, fast, ugly. Third, <strong>engineer</strong> to produce. Never reverse this order. CAD optimizes before you discover.</div>'

            + '<div class="voice-designer"><span class="designer-name">Prouve</span>'
            + 'Cut a side profile from double-wall cardboard. Make two profiles, connect them with cross pieces at the seat and rail heights. Sit in it. Where it collapses — those are your force concentration points. Reinforce, sit again, find the next failure. It costs nothing. Midnight, living room floor.</div>'

            + '<div class="voice-designer"><span class="designer-name">Morrison</span>'
            + '&ldquo;Each prototype answers exactly ONE question. If you try to answer five, you learn nothing from the failure. And if you\'re not embarrassed by how crude it looks, you spent too long on it.&rdquo;</div>'

            + '<hr>'

            + '<h3>The Assignment</h3>'

            + '<p class="voice-me">The table gave me homework.</p>'

            + '<p>Build a <strong>seat</strong> — not a full chair — from cardboard. 16-18&Prime; wide, 15-17&Prime; deep, 12-15&Prime; high. Laminate 3-4 layers with alternating flute directions. Sit test with eyes closed. Mark the pressure points with a pen. Photograph from the side while seated. Then answer: what did the body tell you?</p>'

            + '<div class="voice-designer"><span class="designer-name">Prouve</span>'
            + 'A coffee table is 16-18&Prime; high. Your seat must be at or slightly above the table surface — that\'s 12-15&Prime;. This height is between dining and lounge. It doesn\'t exist yet.</div>',
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
