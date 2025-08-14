const fs = require('fs');
const path = require('path');

function parseFrontmatter(fileContent) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  if (!match) return { frontmatter: {} };
  
  let frontMatterBlock = match[1];
  let frontMatterLines = frontMatterBlock.trim().split('\n');
  let frontmatter = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
    try {
      frontmatter[key.trim()] = JSON.parse(value);
    } catch {
      frontmatter[key.trim()] = value;
    }
  });

  return { frontmatter };
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { frontmatter } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      frontmatter,
      slug,
    };
  });
}

function generatePostsData() {
  console.log('🚀 Generating posts data...');
  
  const contentDir = path.join(process.cwd(), 'content');
  const outputDir = path.join(process.cwd(), '.data');
  const postsOutputFile = path.join(outputDir, 'posts.json');
  const tagsOutputFile = path.join(outputDir, 'tags.json');

  // Create .data directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const posts = getMDXData(contentDir).sort((a, b) => {
    return (
      new Date(b.frontmatter.createdTime).getTime() -
      new Date(a.frontmatter.createdTime).getTime()
    );
  });

  // Generate posts.json
  fs.writeFileSync(postsOutputFile, JSON.stringify(posts, null, 2));
  
  // Extract and count tags
  const tagCounts = {};
  posts.forEach(post => {
    if (post.frontmatter.tags && Array.isArray(post.frontmatter.tags)) {
      post.frontmatter.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  // Convert to array format sorted by count (descending) then by name (ascending)
  const tagsArray = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count; // Sort by count descending
      }
      return a.name.localeCompare(b.name); // Sort by name ascending if counts are equal
    });

  // Generate tags.json
  fs.writeFileSync(tagsOutputFile, JSON.stringify(tagsArray, null, 2));
  
  console.log(`✅ Generated ${posts.length} posts data to ${postsOutputFile}`);
  console.log(`✅ Generated ${tagsArray.length} tags data to ${tagsOutputFile}`);
}

// Run if called directly
if (require.main === module) {
  generatePostsData();
}

module.exports = { generatePostsData };