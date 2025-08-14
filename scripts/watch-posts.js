const fs = require('fs');
const path = require('path');
const { generatePostsData } = require('./generate-posts-data');

function watchPosts() {
  console.log('👀 Watching content directory for changes...');
  
  const contentDir = path.join(process.cwd(), 'content');
  
  // Generate initial data
  generatePostsData();
  
  // Watch for changes in content directory
  fs.watch(contentDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.mdx')) {
      console.log(`📝 Content file changed: ${filename}`);
      console.log('🔄 Regenerating posts data...');
      
      // Debounce multiple rapid changes
      clearTimeout(watchPosts.timeout);
      watchPosts.timeout = setTimeout(() => {
        generatePostsData();
      }, 300);
    }
  });
}

// Run if called directly
if (require.main === module) {
  watchPosts();
}

module.exports = { watchPosts };