# AI Chatbot Platform

A Next.js application that allows professors to create and manage AI-powered chatbots that can be embedded on any website. The platform uses HuggingFace inference API for AI responses and provides a complete dashboard for bot management.

## Features

- **Professor Dashboard**: Create, edit, and manage multiple chatbots
- **Embeddable Widget**: One-line script integration for any website
- **HuggingFace Integration**: Secure server-side API proxy
- **Customizable Bots**: Theme colors, positions, welcome messages
- **Mock Authentication**: Simple email-based login for demo purposes
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### 1. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
HUGGINGFACE_MODEL=google/flan-t5-small
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 2. Get HuggingFace API Key

1. Go to [HuggingFace](https://huggingface.co/)
2. Create an account and get your API key from Settings > Access Tokens
3. For testing, use lightweight models like:
   - `google/flan-t5-small` (recommended for testing)
   - `gpt2` (very basic)
   - `microsoft/DialoGPT-small` (chat-optimized)

### 3. Install and Run

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the platform.

## Deployment to Vercel

### 1. Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
\`\`\`

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard:
   - `HUGGINGFACE_API_KEY`: Your HuggingFace API key
   - `HUGGINGFACE_MODEL`: Model to use (e.g., `google/flan-t5-small`)
   - `NEXT_PUBLIC_APP_URL`: Your Vercel app URL (e.g., `https://your-app.vercel.app`)

### 3. Use the Widget

After deployment, you can embed chatbots on any website:

\`\`\`html
<script src="https://your-app.vercel.app/widget.js" data-botid="your-bot-id"></script>
\`\`\`

## How to Use

1. **Login**: Use any email address to access the dashboard
2. **Create Bot**: Click "Create Bot" and configure settings
3. **Copy Embed Code**: Click the copy button to get the embed script
4. **Test**: Paste the script into any HTML page to test

## Architecture

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **UI Components**: shadcn/ui component library
- **State Management**: localStorage for MVP (client-side only)
- **AI Integration**: HuggingFace Inference API via serverless proxy
- **Embedding**: Universal JavaScript widget with iframe fallback

## File Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/page.tsx       # Professor dashboard
│   ├── embed/chat/page.tsx      # Embedded chat interface
│   └── api/chat/route.ts        # HuggingFace API proxy
├── public/
│   └── widget.js                # Universal embed script
├── components/ui/               # shadcn/ui components
└── README.md
\`\`\`

## Security Notes

- API keys are kept server-side only
- CORS protection on API routes
- Rate limiting should be added for production
- Authentication is mock-only for MVP

## Future Enhancements

- **File Upload**: Document ingestion and RAG pipeline
- **Vector Database**: Semantic search capabilities
- **Streaming Responses**: Real-time token-by-token responses
- **Authentication**: JWT-based user management
- **Database**: Persistent bot storage and analytics
- **Multi-tenant**: Organization and team management
- **Advanced Analytics**: Usage tracking and insights

## Troubleshooting

### Common Issues

1. **"HuggingFace API key not configured"**
   - Ensure `HUGGINGFACE_API_KEY` is set in environment variables

2. **Model loading errors**
   - Try switching to `google/flan-t5-small` for reliable testing
   - Some models may take time to "warm up" on first use

3. **Widget not appearing**
   - Check that `NEXT_PUBLIC_APP_URL` matches your deployment URL
   - Verify the script tag has the correct `data-botid` attribute

4. **CORS errors**
   - Ensure you're testing on the same domain or add CORS headers

## Development Checklist

- [x] Next.js app scaffolding and file structure
- [x] Mock login and dashboard pages
- [x] Bot creation and management with localStorage
- [x] Universal widget.js script with iframe injection
- [x] Embedded chat UI with real-time messaging
- [x] HuggingFace API proxy with secure key handling
- [x] Responsive design and mobile support
- [x] README with deployment instructions
- [x] Environment variable configuration

## Testing

To test the complete flow:

1. Deploy to Vercel and set environment variables
2. Create a bot in the dashboard
3. Copy the embed code
4. Create a simple HTML file and paste the script
5. Open the HTML file and test the chat functionality

The widget should appear as a floating button that opens a chat interface when clicked.
