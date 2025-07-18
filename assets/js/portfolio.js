// Portfolio interactions
document.addEventListener('DOMContentLoaded', function() {
    const projectTitles = document.querySelectorAll('.project-title');
    const tooltip = document.getElementById('tooltip');
    const modal = document.getElementById('modal');
    const modalClose = document.querySelector('.modal-close');
    const modalBody = document.querySelector('.modal-body');
    
    // Helper function to find project data
    function getProjectData(projectId) {
        return projects.find(p => p.id === projectId);
    }
    
    // Create tooltip content
    function createTooltipContent(project) {
        return `
            <h3>${project.title}</h3>
            <p><strong>About:</strong> ${project.about}</p>
            <p><strong>Stack:</strong> ${project.stack.join(', ')}</p>
            <p><strong>Date:</strong> ${project.date}</p>
            <div class="tags">${project.tags.join(' • ')}</div>
        `;
    }
    
    // Create modal content
    function createModalContent(project) {
        return `
            <h2>${project.title}</h2>
            
            <div class="section">
                <h3>About</h3>
                <p>${project.about}</p>
            </div>
            
            <div class="section">
                <h3>Capabilities</h3>
                <ul>
                    ${project.capabilities.map(cap => `<li>${cap}</li>`).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h3>Tech Stack</h3>
                <p>${project.stack.join(', ')}</p>
            </div>
            
            <div class="section">
                <h3>Details</h3>
                <p><strong>Date:</strong> ${project.date}</p>
                <p><strong>Tags:</strong> ${project.tags.join(', ')}</p>
            </div>
            
            <a href="${project.link}" class="demo-link" target="_blank">View Project</a>
        `;
    }
    
    // Position tooltip near cursor
    function positionTooltip(e) {
        const rect = tooltip.getBoundingClientRect();
        const margin = 10;
        
        let x = e.clientX + margin;
        let y = e.clientY + margin;
        
        // Keep tooltip on screen
        if (x + rect.width > window.innerWidth) {
            x = e.clientX - rect.width - margin;
        }
        if (y + rect.height > window.innerHeight) {
            y = e.clientY - rect.height - margin;
        }
        
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }
    
    // Add event listeners to each project title
    projectTitles.forEach(title => {
        const projectId = title.dataset.project;
        const project = getProjectData(projectId);
        
        if (!project) return;
        
        // Set project color
        title.style.color = project.color;
        
        // Mouse enter - show tooltip and fade others
        title.addEventListener('mouseenter', function(e) {
            // Show tooltip
            tooltip.innerHTML = createTooltipContent(project);
            tooltip.classList.remove('hidden');
            positionTooltip(e);
            
            // Fade other titles
            projectTitles.forEach(otherTitle => {
                if (otherTitle !== title) {
                    otherTitle.classList.add('faded');
                }
            });
        });
        
        // Mouse move - update tooltip position
        title.addEventListener('mousemove', function(e) {
            positionTooltip(e);
        });
        
        // Mouse leave - hide tooltip and restore others
        title.addEventListener('mouseleave', function() {
            tooltip.classList.add('hidden');
            
            // Remove fade from other titles
            projectTitles.forEach(otherTitle => {
                otherTitle.classList.remove('faded');
            });
        });
        
        // Click - show modal
        title.addEventListener('click', function() {
            modalBody.innerHTML = createModalContent(project);
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    });
    
    // Close modal functionality
    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scroll
    }
    
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});