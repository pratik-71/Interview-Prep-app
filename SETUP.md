# Interview Prep App Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Gemini AI API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Installation

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Install Gemini AI Package

```bash
npm install @google/generative-ai
# or
yarn add @google/generative-ai
```

### 3. Environment Setup

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important:** Replace `your_actual_gemini_api_key_here` with your real Gemini API key.

### 4. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it in your `.env` file

## Features

### Interview Questions Generation
- **8 Beginner Questions**: Basic concepts and fundamental knowledge
- **8 Intermediate Questions**: Practical experience and problem-solving
- **8 Expert Questions**: Advanced concepts, leadership, and architecture

### Supported Fields
- **Information Technology**: Full Stack, Frontend, Backend, DevOps, Data Science, Cybersecurity, Mobile, QA
- **Science**: Physics, Chemistry, Biology, Mathematics, Engineering
- **Commerce & Business**: Finance, Marketing, HR, Operations, Sales, Accounting
- **Healthcare**: Nursing, Pharmacy, Medical Research, Public Health
- **Education**: Teaching, Administration, Curriculum, Special Education

### AI-Powered Features
- **Dynamic Question Generation**: Tailored to selected field and subfield
- **Custom Notes Integration**: AI considers your specific focus areas
- **Comprehensive Answers**: Detailed explanations with pro tips
- **Difficulty Progression**: Structured learning from beginner to expert

## Usage

1. **Select Field**: Choose your industry/domain
2. **Select Subfield**: Choose your specific role or specialization
3. **Add Notes**: (Optional) Specify areas you want to focus on
4. **Generate Questions**: AI creates 24 tailored interview questions
5. **Practice**: Review questions by difficulty level
6. **Learn**: Expand answers to see explanations and tips

## Technical Details

- **AI Model**: Gemini 1.5 Flash
- **Question Count**: 24 questions total (8 per difficulty level)
- **Response Format**: Structured JSON with questions, answers, explanations, and tips
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Animated loading with progress indicators

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your `.env` file is in the correct location and contains the right API key
2. **Network Issues**: Check your internet connection
3. **Rate Limiting**: Gemini has rate limits; wait a moment and try again

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure you have sufficient Gemini API quota

## Security Notes

- **Never commit your `.env` file** to version control
- **Keep your API key private** and don't share it publicly
- **Monitor your API usage** to avoid unexpected charges
