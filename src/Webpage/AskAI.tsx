import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../zustand_store/theme_store';
import GeminiService from '../services/geminiService';

const AskAI: React.FC = () => {
	const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore();
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

	return (
		<div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ backgroundColor: secondaryColor }}>
			<div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 custom-scrollbar">
				<div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto py-6 md:py-8 lg:py-10">
					<div className="text-center mb-4 md:mb-6 lg:mb-8">
						<h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold" style={{ color: tertiaryColor }}>
							Ask AI
						</h1>
						<p className="text-base md:text-lg lg:text-xl xl:text-2xl" style={{ color: `${tertiaryColor}80` }}>
							Ask any question and get an instant answer.
						</p>
					</div>

					{/* Messages */}
					<div className="space-y-3 md:space-y-5 lg:space-y-6">
						{messages.map((m, i) => (
							<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
								<div
									className={`max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[65%] rounded-2xl px-4 md:px-5 lg:px-6 py-3 md:py-4 lg:py-5 text-sm md:text-base lg:text-lg xl:text-xl shadow bg-white border`}
									style={{ borderColor: `${primaryColor}20`, color: tertiaryColor }}
								>
									{m.content}
								</div>
							</div>
						))}

						{isLoading && (
							<div className="flex justify-start">
								<div className="rounded-2xl px-4 md:px-5 lg:px-6 py-3 md:py-4 lg:py-5 text-sm md:text-base lg:text-lg border bg-white" style={{ borderColor: `${primaryColor}20`, color: tertiaryColor }}>
									<span className="inline-flex items-center space-x-2">
										<span>Thinking</span>
										<span className="inline-flex">
											<span className="w-1.5 md:w-2 lg:w-2.5 h-1.5 md:h-2 lg:h-2.5 rounded-full mr-1 animate-bounce" style={{ backgroundColor: primaryColor }} />
											<span className="w-1.5 md:w-2 lg:w-2.5 h-1.5 md:h-2 lg:h-2.5 rounded-full mr-1 animate-bounce" style={{ backgroundColor: primaryColor }} />
											<span className="w-1.5 md:w-2 lg:w-2.5 h-1.5 md:h-2 lg:h-2.5 rounded-full animate-bounce" style={{ backgroundColor: primaryColor }} />
										</span>
									</span>
								</div>
							</div>
						)}

						<div ref={endRef} />
					</div>

					{/* Sticky input */}
					<form onSubmit={handleAsk} className="mt-4 md:mt-6 lg:mt-8 sticky bottom-4 bg-white rounded-2xl shadow-lg p-3 md:p-5 lg:p-6 border border-gray-100">
						<div className="flex items-end space-x-2 md:space-x-3 lg:space-x-4">
							<textarea
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
								className="flex-1 border border-gray-300 rounded-xl p-3 md:p-4 lg:p-5 text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2"
								style={{ resize: 'none', maxHeight: 160 }}
								rows={2}
								placeholder="Type your question here..."
							/>
							<button
								type="submit"
								disabled={isLoading}
								className="shrink-0 inline-flex items-center px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-lg text-sm md:text-base lg:text-lg text-white font-medium disabled:opacity-60"
								style={{ backgroundColor: primaryColor }}
							>
								{isLoading ? '...' : 'Send'}
							</button>
						</div>
						{/* Quick prompts */}
						<div className="mt-2 md:mt-3 lg:mt-4 flex flex-wrap gap-2 md:gap-3 lg:gap-4">
							{['Explain closures in JS', 'What is REST vs GraphQL?', 'Optimize React performance'].map(p => (
								<button
									key={p}
									type="button"
									onClick={() => setQuestion(p)}
									className="px-2 md:px-3 lg:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm lg:text-base border"
									style={{ borderColor: `${primaryColor}30`, color: tertiaryColor, backgroundColor: `${primaryColor}08` }}
								>
									{p}
								</button>
							))}
						</div>
					</form>

				</div>
			</div>
		</div>
	);
};

export default AskAI;


