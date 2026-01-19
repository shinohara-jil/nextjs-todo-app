#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ISSUE_TITLE = process.env.ISSUE_TITLE;
const ISSUE_BODY = process.env.ISSUE_BODY;
const ISSUE_NUMBER = process.env.ISSUE_NUMBER;

if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is not set');
  process.exit(1);
}

// Claude APIを呼び出す関数
async function callClaudeAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (response.content && response.content[0] && response.content[0].text) {
            resolve(response.content[0].text);
          } else {
            reject(new Error('Unexpected API response format'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// コードブロックを抽出する関数
function extractCodeBlocks(text) {
  const codeBlocks = [];
  const regex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const language = match[1] || 'text';
    const code = match[2];
    codeBlocks.push({ language, code });
  }

  return codeBlocks;
}

// ファイルパスとコードを抽出
function extractFiles(text) {
  const files = [];
  const lines = text.split('\n');
  let currentFile = null;
  let currentCode = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ファイルパス検出 (例: `app/api/todos/route.ts`)
    const fileMatch = line.match(/^`([^`]+\.(ts|tsx|js|jsx|json|sql|md))`/);
    if (fileMatch) {
      if (currentFile && currentCode.length > 0) {
        files.push({ path: currentFile, code: currentCode.join('\n') });
      }
      currentFile = fileMatch[1];
      currentCode = [];
      continue;
    }

    // コードブロック開始
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    // コードブロック内ならコードを保存
    if (inCodeBlock && currentFile) {
      currentCode.push(line);
    }
  }

  // 最後のファイルを保存
  if (currentFile && currentCode.length > 0) {
    files.push({ path: currentFile, code: currentCode.join('\n') });
  }

  return files;
}

// メイン処理
async function main() {
  console.log('Starting Claude implementation...');
  console.log(`Issue #${ISSUE_NUMBER}: ${ISSUE_TITLE}`);

  // プロンプト作成
  const prompt = `You are an expert software developer. Please implement the following GitHub Issue:

**Issue Title**: ${ISSUE_TITLE}

**Issue Description**:
${ISSUE_BODY}

**Instructions**:
1. Read the issue carefully and understand the requirements
2. Implement the necessary code changes
3. Create or modify files as needed
4. Follow the existing code style and architecture
5. Include all necessary imports and dependencies

**Important**:
- For each file you create or modify, use this format:
\`path/to/file.ts\`
\`\`\`typescript
// code here
\`\`\`

- Make sure to include the full file path
- Write production-ready code with proper error handling
- Add comments in Japanese where appropriate

Please provide the implementation now.`;

  try {
    // Claude APIを呼び出し
    const response = await callClaudeAPI(prompt);
    console.log('Claude API response received');

    // レスポンスをファイルに保存（デバッグ用）
    fs.writeFileSync('.github/scripts/claude-response.txt', response);

    // ファイルを抽出
    const files = extractFiles(response);

    if (files.length === 0) {
      console.log('No files found in response. Trying alternative extraction...');

      // コードブロックを直接抽出
      const codeBlocks = extractCodeBlocks(response);
      console.log(`Found ${codeBlocks.length} code blocks`);

      // 手動でファイルを作成する必要がある場合の処理
      // ここでは簡易的にレスポンスをログに出力
      console.log('Response content:');
      console.log(response);
    } else {
      console.log(`Extracted ${files.length} files`);

      // 各ファイルを作成
      for (const file of files) {
        const fullPath = path.join(process.cwd(), file.path);
        const dir = path.dirname(fullPath);

        // ディレクトリ作成
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // ファイル作成
        fs.writeFileSync(fullPath, file.code);
        console.log(`Created: ${file.path}`);
      }
    }

    console.log('Implementation completed successfully');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
