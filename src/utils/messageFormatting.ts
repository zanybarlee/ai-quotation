
// Helper function to format links in text
export const formatLinks = (text: string) => {
  // Regex for markdown links - [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return text.replace(
    linkRegex,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
  );
};

// Helper function to format code blocks
export const formatCodeBlocks = (text: string) => {
  // Regex for code blocks - ```code```
  const codeBlockRegex = /```([^`]+)```/g;
  let formattedText = text;
  
  // Replace code blocks with styled pre elements
  formattedText = formattedText.replace(
    codeBlockRegex,
    '<pre class="bg-gray-800 text-gray-100 p-3 rounded-md overflow-auto my-2">$1</pre>'
  );
  
  // Regex for inline code - `code`
  const inlineCodeRegex = /`([^`]+)`/g;
  formattedText = formattedText.replace(
    inlineCodeRegex,
    '<code class="bg-gray-200 rounded px-1 py-0.5">$1</code>'
  );
  
  return formattedText;
};

// Helper function to format basic markdown
export const formatMarkdown = (text: string, isUserMessage: boolean) => {
  // Start with code blocks to avoid interference with other formatting
  let formattedText = formatCodeBlocks(text);
  
  // Format links
  formattedText = formatLinks(formattedText);
  
  // Format bold text - **text**
  formattedText = formattedText.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong>$1</strong>'
  );
  
  // Format italic text - *text*
  formattedText = formattedText.replace(
    /\*([^*]+)\*/g,
    '<em>$1</em>'
  );
  
  // Format headings - # Heading
  formattedText = formattedText.replace(
    /^# (.+)$/gm,
    '<h1 class="text-xl font-bold mt-3 mb-2">$1</h1>'
  );
  
  formattedText = formattedText.replace(
    /^## (.+)$/gm,
    '<h2 class="text-lg font-bold mt-2 mb-1">$1</h2>'
  );
  
  formattedText = formattedText.replace(
    /^### (.+)$/gm,
    '<h3 class="text-md font-bold mt-2 mb-1">$1</h3>'
  );
  
  // Format lists - simple unordered lists
  formattedText = formattedText.replace(
    /^- (.+)$/gm,
    '<li class="ml-4">$1</li>'
  );

  // Wrap paragraphs that aren't already wrapped in HTML tags
  const lines = formattedText.split('\n');
  formattedText = lines.map(line => {
    // Skip lines that are already HTML elements
    if (line.trim().startsWith('<') && line.trim().endsWith('>')) return line;
    // Skip empty lines
    if (line.trim() === '') return line;
    // Wrap other lines in paragraph tags
    return `<p>${line}</p>`;
  }).join('\n');
  
  return formattedText;
};
