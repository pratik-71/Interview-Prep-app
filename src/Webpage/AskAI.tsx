import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../zustand_store/theme_store';
import GeminiService from '../services/geminiService';

const AskAI: React.FC = () => {
	const { 
		primaryColor, 
		backgroundColor, 
		surfaceColor, 
		textColor, 
		textSecondaryColor,
		borderColor,
		inputColor,
		cardColor
	} = useThemeStore();
	
	const [question, setQuestion] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
	const endRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, isLoading]);

	const handleAsk = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!question.trim()) return;
		
		setIsLoading(true);
		setMessages(prev => [...prev, { role: 'user', content: question }]);
		
		try {
			const gemini = GeminiService.getInstance();
			const response = await gemini.askQuestion(
				question,
				'You are a helpful assistant. Answer clearly and concisely.'
			);
			setMessages(prev => [...prev, { role: 'ai', content: response }]);
			setQuestion('');
		} catch (err) {
			const msg = 'Sorry, something went wrong. Please try again later.';
			setMessages(prev => [...prev, { role: 'ai', content: msg }]);
		} finally {
			setIsLoading(false);
		}
	};

	const quickPrompts = [
		'Explain closures in JavaScript',
		'What is REST vs GraphQL?',
		'Explain async/await'
	];

	return (
		<div className="flex flex-col transition-colors duration-300 h-full" 
		     style={{ backgroundColor: backgroundColor }}>
			
			{/* Header Section - Fixed */}
			<div className="flex-shrink-0 px-4 sm:px-6 py-6 sm:py-8 text-center" style={{ backgroundColor: surfaceColor }}>
				<div className="max-w-2xl mx-auto">
					<div className="flex items-center justify-center space-x-3 sm:space-x-4">
						<div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center" 
						     style={{ backgroundColor: `${primaryColor}15` }}>
							<svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
							</svg>
						</div>
						<h1 className="text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-300" style={{ color: textColor }}>
							Ask AI
						</h1>
					</div>
				</div>
			</div>

			{/* Messages Container - Scrollable with proper height */}
			<div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 custom-scrollbar">
				<div className="max-w-4xl mx-auto py-6">
					{/* Messages */}
					<div className="space-y-6">
						{messages.map((message, index) => (
							<div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
								<div className={`max-w-[85%] lg:max-w-[70%] xl:max-w-[65%]`}>
									<div
										className={`rounded-2xl px-6 py-4 shadow-sm transition-all duration-300 ${
											message.role === 'user' 
												? 'ml-auto' 
												: 'mr-auto'
										}`}
										style={{ 
											backgroundColor: message.role === 'user' ? primaryColor : cardColor,
											color: message.role === 'user' ? 'white' : textColor,
											border: message.role === 'ai' ? `1px solid ${borderColor}` : 'none'
										}}
									>
										<div className="flex items-start space-x-3">
											<div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
												message.role === 'user' ? 'bg-white bg-opacity-20' : `${primaryColor}15`
											}`}>
												{message.role === 'user' ? (
													<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
													</svg>
												) : (
													<svg className="w-4 h-4" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
													</svg>
												)}
											</div>
											
											<div className="flex-1 min-w-0">
												<div className="text-base leading-relaxed whitespace-pre-wrap">
													{message.content}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}

						{/* Loading Indicator */}
						{isLoading && (
							<div className="flex justify-start">
								<div className="max-w-[85%] lg:max-w-[70%] xl:max-w-[65%]">
									<div className="rounded-2xl px-6 py-4 shadow-sm border transition-colors duration-300" 
									     style={{ backgroundColor: cardColor, borderColor: borderColor }}>
										<div className="flex items-center space-x-3">
											<div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
												<svg className="w-4 h-4" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
												</svg>
											</div>
											<div className="flex-1">
												<div className="flex items-center space-x-2">
													<span className="text-base" style={{ color: textSecondaryColor }}>Thinking</span>
													<div className="flex space-x-1">
														<div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, animationDelay: '0ms' }}></div>
														<div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, animationDelay: '150ms' }}></div>
														<div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, animationDelay: '300ms' }}></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						<div ref={endRef} />
					</div>
				</div>
			</div>

			{/* Input Section - Fixed at Bottom */}
			<div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-6" style={{ backgroundColor: surfaceColor }}>
				<div className="max-w-4xl mx-auto">
					{/* Quick Prompts */}
					{messages.length === 0 && (
						<div className="mb-6">
							<div className="flex flex-wrap justify-center gap-3">
								{quickPrompts.map((prompt, index) => (
									<button
										key={index}
										type="button"
										onClick={() => setQuestion(prompt)}
										className="px-4 py-2 rounded-full text-sm border transition-all duration-200 hover:scale-105"
										style={{ 
											borderColor: `${primaryColor}30`, 
											color: textSecondaryColor, 
											backgroundColor: `${primaryColor}08` 
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = `${primaryColor}15`;
											e.currentTarget.style.borderColor = `${primaryColor}50`;
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = `${primaryColor}08`;
											e.currentTarget.style.borderColor = `${primaryColor}30`;
										}}
									>
										{prompt}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Input Form */}
					<form onSubmit={handleAsk} className="relative">
						<div className="flex items-end space-x-4">
							<div className="flex-1 relative">
								<textarea
									value={question}
									onChange={(e) => setQuestion(e.target.value)}
									className="w-full border rounded-2xl px-6 py-4 text-base focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
									style={{ 
										minHeight: '56px',
										maxHeight: '120px',
										backgroundColor: inputColor,
										borderColor: borderColor,
										color: textColor
									}}
									rows={1}
									placeholder="Ask me anything..."
									onFocus={(e) => {
										e.currentTarget.style.backgroundColor = primaryColor;
										e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}20`;
									}}
									onBlur={(e) => {
										e.currentTarget.style.backgroundColor = inputColor;
										e.currentTarget.style.boxShadow = 'none';
									}}
								/>
							</div>
							
							<button
								type="submit"
								disabled={!question.trim() || isLoading}
								className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
								style={{ backgroundColor: primaryColor }}
							>
								{isLoading ? (
									<svg className="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
								) : (
									<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
									</svg>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AskAI;


