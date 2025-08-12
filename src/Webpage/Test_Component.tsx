import React, { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '../zustand_store/theme_store'
import { AnswerEvaluation, AudioAnswerEvaluation, GeminiService } from '../services/geminiService'

const Test_Component = ({question, onBack}: {question: any, onBack: () => void}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [difficulty, setDifficulty] = useState('beginner')
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const [hasResponseArrived,setHasResponseArrived] = useState(false)
  const [isAudioResult, setIsAudioResult] = useState(false)
  const [audioResult, setAudioResult] = useState<AudioAnswerEvaluation | null>(null)
  const [testResult, setTestResult] = useState<AnswerEvaluation | null>(null)
  const [isEvaluatingText, setIsEvaluatingText] = useState(false)
  
  // Refs for auto-scrolling to results
  const textResultRef = useRef<HTMLDivElement>(null)
  const audioResultRef = useRef<HTMLDivElement>(null)
  
    // Get colors from theme store
  const { primaryColor, secondaryColor, tertiaryColor } = useThemeStore()

  // Auto-scroll to results when they arrive
  useEffect(() => {
    if (hasResponseArrived) {
      const targetRef = isAudioResult ? audioResultRef.current : textResultRef.current
      if (targetRef) {
        // Add a small delay to ensure the DOM has updated
        setTimeout(() => {
          targetRef.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }, 100)
      }
    }
  }, [hasResponseArrived, isAudioResult])

  const handleSubmitText = async () => {
    try {
      if (answer.trim()) {
        setIsEvaluatingText(true)
        
        // Get current question for context
        const currentQuestion = question[currentQuestionIndex]?.question || 'Interview question'
        
        // Evaluate text answer using Gemini
        const geminiService = GeminiService.getInstance()
        const evaluation = await geminiService.evaluateAnswer(currentQuestion, answer)
        
        // Set the result and trigger display
        setTestResult(evaluation)
        setIsAudioResult(false)
        setHasResponseArrived(true)
        
        console.log('Text answer evaluated:', evaluation)
      }
    } catch (error) {
      console.error('Error evaluating text answer:', error)
      alert('Failed to evaluate answer. Please try again.')
    } finally {
      setIsEvaluatingText(false)
    }
  }

  const handleSubmitAudio = async () => {
    try {
      // This will be called when audio is submitted from the recording modal
      // The actual audio evaluation will happen in the Record_Answer component
      console.log('Audio answer submitted for evaluation')
      setHasResponseArrived(true)
    } catch (error) {
      console.error('Error handling audio submission:', error)
    }
  }

  // Check if we have questions and if current index is valid
  if (!question || !Array.isArray(question) || question.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: secondaryColor }}>
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: `${primaryColor}15` }}>
            <svg className="w-10 h-10" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: tertiaryColor }}>No Questions Available</h2>
          <p className="text-lg" style={{ color: `${tertiaryColor}80` }}>Please load some questions first</p>
        </div>
      </div>
    )
  }

  // Filter questions by selected difficulty
  const filteredQuestions = question.filter((q: any) => q.category === difficulty)

  if (currentQuestionIndex >= filteredQuestions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: secondaryColor }}>
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: `${primaryColor}15` }}>
            <svg className="w-10 h-10" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a10 10 0 100-20 10 10 0 000 20z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: tertiaryColor }}>Test Completed!</h2>
          <p className="text-lg mb-6" style={{ color: `${tertiaryColor}80` }}>You've answered all the questions</p>
          <button 
            onClick={() => setCurrentQuestionIndex(0)}
            className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            Restart Test
          </button>
        </div>
      </div>
    )
  }
  const currentQuestion = filteredQuestions[currentQuestionIndex]
  const progressPercentage = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100

  return (
    <div className="h-screen p-4 sm:p-6 md:p-8 pb-20 sm:pb-24 md:pb-28 overflow-y-auto custom-scrollbar" style={{ backgroundColor: secondaryColor }}>
      {/* Header Section */}
       
       <div className='flex justify-between mb-4'>
        <button 
          onClick={onBack}
          className='py-2 px-4 rounded-lg text-white transition-all duration-300 hover:scale-105' 
          style={{ backgroundColor: primaryColor }}
        > 
          Back 
        </button>
        
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)} 
          className="py-2 px-4 rounded-lg border-2 focus:outline-none"
          style={{ 
            backgroundColor: 'white',
            borderColor: `${primaryColor}30`,
            color: tertiaryColor
          }}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        
       </div>

      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: tertiaryColor }}>
              Interview Test
            </h1>
            <span className="text-lg font-semibold" style={{ color: primaryColor }}>
              {currentQuestionIndex + 1} / {filteredQuestions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: primaryColor
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 mb-8">

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 leading-relaxed" 
              style={{ color: tertiaryColor }}>
            {currentQuestion.question}
          </h2>

          {/* Answer Input */}
          <div className="mb-4">
            <div className='flex justify-between items-center mb-4'>
            <label className="block text-lg font-semibold mb-2" style={{ color: primaryColor }}>
              Your Answer:
            </label>
            <button onClick={() => setShowRecordingModal(true)} className='py-2 px-4 text-sm rounded-lg' style={{ backgroundColor: primaryColor, color: 'white' }}>
             Record Answer  
            </button>
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 rounded-xl text-lg resize-none focus:outline-none focus:ring-4 transition-all duration-300"
              style={{ 
                borderColor: `${primaryColor}30`,
                backgroundColor: `${primaryColor}05`,
                color: tertiaryColor,
                minHeight: '200px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = primaryColor
                e.target.style.backgroundColor = `${primaryColor}08`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${primaryColor}30`
                e.target.style.backgroundColor = `${primaryColor}05`
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Submit Button */}
            <button 
              onClick={handleSubmitText}
              disabled={!answer.trim() || isEvaluatingText}
              className="flex-1 px-4 py-2 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ 
                backgroundColor: answer.trim() && !isEvaluatingText ? primaryColor : `${primaryColor}50`
              }}
            >
              {isEvaluatingText ? 'Evaluating...' : 'Submit Answer'}
            </button>

            {/* Next Button */}
           <div className='flex justify-between gap-4'>
           <button 
              onClick={() => {
                setCurrentQuestionIndex(currentQuestionIndex - 1)
                setAnswer('')
              }}
              disabled={currentQuestionIndex === 0}
              className="flex-1 px-4 py-2 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 border-2 shadow-lg"
              style={{ 
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: 'transparent'
              }}
            >
              Prev
            </button>

            <button 
              onClick={() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1)
                setAnswer('')
              }}
              disabled={currentQuestionIndex === question.length - 1}
              className="flex-1 px-4 py-2 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 border-2 shadow-lg"
              style={{ 
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: 'transparent'
              }}
            >
              Next
            </button>
           </div>
          </div>
        </div>

        {/* Text Result Display */}
        {!isAudioResult && hasResponseArrived && testResult && (
          <div ref={textResultRef} className='bg-white rounded-2xl shadow-xl p-4 sm:p-4 md:p-6 mb-8'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 rounded-full flex items-center justify-center' style={{ backgroundColor: `${primaryColor}15` }}>
                <svg className='w-6 h-6' style={{ color: primaryColor }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h2 className='text-xl sm:text-2xl md:text-3xl font-bold' style={{ color: tertiaryColor }}>
                Text Answer Evaluation
              </h2>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
              {/* Marks Section */}
              <div className='p-3 rounded-xl' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ backgroundColor: primaryColor }}>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                    </svg>
                  </div>
                  <span className='text-lg font-semibold' style={{ color: tertiaryColor }}>Overall Score</span>
                </div>
                <div className='text-3xl font-bold' style={{ color: primaryColor }}>
                  {testResult.marks}/10
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div 
                    className='h-2 rounded-full transition-all duration-500'
                    style={{ 
                      width: `${(testResult.marks / 10) * 100}%`,
                      backgroundColor: primaryColor
                    }}
                  />
                </div>
              </div>

              {/* Feedback Section */}
              <div className='p-3 rounded-xl' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ backgroundColor: primaryColor }}>
                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                    </svg>
                  </div>
                  <span className='text-lg font-semibold' style={{ color: tertiaryColor }}>Feedback</span>
                </div>
                <p className='text-base leading-relaxed' style={{ color: tertiaryColor }}>
                  {testResult.feedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Audio Result Display */}
        {isAudioResult && hasResponseArrived && audioResult && (
          <div ref={audioResultRef} className='bg-white rounded-2xl shadow-xl p-4 sm:p-4 md:p-6 mb-8'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 rounded-full flex items-center justify-center' style={{ backgroundColor: `${primaryColor}15` }}>
                <svg className='w-6 h-6' style={{ color: primaryColor }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' />
                </svg>
              </div>
              <h2 className='text-xl sm:text-2xl md:text-3xl font-bold' style={{ color: tertiaryColor }}>
                Audio Answer Evaluation
              </h2>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-1 mb-6'>
              {/* Overall Marks */}
              <div className='p-3 rounded-xl text-center' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='text-2xl font-bold' style={{ color: primaryColor }}>
                  {audioResult.marks}/100
                </div>
                <div className='text-sm font-medium' style={{ color: tertiaryColor }}>Overall Score</div>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div 
                    className='h-2 rounded-full transition-all duration-500'
                    style={{ 
                      width: `${audioResult.marks}%`,
                      backgroundColor: primaryColor
                    }}
                  />
                </div>
              </div>

              {/* Confidence Marks */}
              <div className='p-3 rounded-xl text-center' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='text-2xl font-bold' style={{ color: primaryColor }}>
                  {audioResult.confidence_marks}/100
                </div>
                <div className='text-sm font-medium' style={{ color: tertiaryColor }}>Confidence</div>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div 
                    className='h-2 rounded-full transition-all duration-500'
                    style={{ 
                      width: `${audioResult.confidence_marks}%`,
                      backgroundColor: primaryColor
                    }}
                  />
                </div>
              </div>

              {/* Fluency Marks */}
              <div className='p-3 rounded-xl text-center' style={{ backgroundColor: `${primaryColor}08` }}>
                <div className='text-2xl font-bold' style={{ color: primaryColor }}>
                  {audioResult.fluency_marks}/100
                </div>
                <div className='text-sm font-medium' style={{ color: tertiaryColor }}>Fluency</div>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div 
                    className='h-2 rounded-full transition-all duration-500'
                    style={{ 
                      width: `${audioResult.fluency_marks}%`,
                      backgroundColor: primaryColor
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className='p-3 rounded-xl' style={{ backgroundColor: `${primaryColor}05` }}>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ backgroundColor: primaryColor }}>
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                  </svg>
                </div>
                <span className='text-lg font-semibold' style={{ color: tertiaryColor }}>Detailed Feedback</span>
              </div>
              <p className='text-base leading-relaxed' style={{ color: tertiaryColor }}>
                {audioResult.feedback}
              </p>
            </div>
          </div>
        )}


      </div>
                          {showRecordingModal && (
               <>
                 {/* Backdrop with blur effect */}
                 <div 
                   className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
                   onClick={() => setShowRecordingModal(false)}
                 />
                 {/* Modal */}
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                   <RecordAnswer 
                     setAnswer={setAnswer} 
                     setShowRecordingModal={setShowRecordingModal} 
                     handleSubmitAudio={handleSubmitAudio}
                     currentQuestion={question[currentQuestionIndex]?.question || 'Interview question'}
                     setAudioResult={setAudioResult}
                     setIsAudioResult={setIsAudioResult}
                   />
                 </div>
               </>
             )}
    </div>
    
  )
}

export default Test_Component

const RecordAnswer = ({setAnswer, setShowRecordingModal, handleSubmitAudio, currentQuestion, setAudioResult, setIsAudioResult}: {setAnswer: (answer: string) => void, setShowRecordingModal: (show: boolean) => void, handleSubmitAudio: () => void, currentQuestion: string, setAudioResult: (result: AudioAnswerEvaluation | null) => void, setIsAudioResult: (isAudio: boolean) => void}) => {
  const { primaryColor, tertiaryColor } = useThemeStore()
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [isEvaluating, setIsEvaluating] = useState(false)

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      
      recorder.ondataavailable = (e) => chunks.push(e.data)
      
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
      
      // Timer for recording
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      recorder.onstop = () => {
        clearInterval(timer)
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setAudioChunks([])
      }
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to record audio')
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  // Play recorded audio
  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
      setIsPlaying(true)
      audio.onended = () => setIsPlaying(false)
    }
  }

  // Handle file upload
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioBlob(file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      setRecordingTime(0)
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden' style={{ border: `1px solid ${primaryColor}20` }}>
      {/* Header */}
      <div className='p-6 pb-4' style={{ backgroundColor: `${primaryColor}05` }}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 rounded-full flex items-center justify-center' style={{ backgroundColor: primaryColor }}>
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' />
              </svg>
            </div>
            <div>
              <h3 className='text-lg font-semibold' style={{ color: tertiaryColor }}>
                Audio Answer
              </h3>
              <p className='text-sm' style={{ color: `${tertiaryColor}70` }}>
                Record or upload your answer
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowRecordingModal(false)}
            className='p-2 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200'
          >
            <svg className='w-5 h-5' style={{ color: tertiaryColor }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        {/* Recording Controls */}
        <div className='space-y-3 mb-6'>
          {!isRecording ? (
            <button 
              onClick={startRecording}
              className='w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg'
              style={{ backgroundColor: primaryColor }}
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' />
              </svg>
              <span className='text-lg'>Start Recording</span>
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className='w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg'
              style={{ backgroundColor: '#ef4444' }}
            >
              <div className='w-4 h-4 rounded-full bg-white animate-pulse'></div>
              <span className='text-lg'>Stop Recording</span>
            </button>
          )}

          {/* Divider */}
          <div className='flex items-center'>
            <div className='flex-1 h-px' style={{ backgroundColor: `${primaryColor}20` }}></div>
            <span className='px-4 text-sm' style={{ color: `${tertiaryColor}50` }}>or</span>
            <div className='flex-1 h-px' style={{ backgroundColor: `${primaryColor}20` }}></div>
          </div>

          {/* Upload Button */}
          <label className='w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg' style={{ borderColor: primaryColor, color: primaryColor }}>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
            </svg>
            <span className='text-lg'>Upload Audio File</span>
            <input type='file' accept='audio/*' className='hidden' onChange={handleAudioChange} />
          </label>
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className='p-4 rounded-xl border-2' style={{ backgroundColor: `${primaryColor}05`, borderColor: `${primaryColor}20` }}>
            <div className='flex items-center space-x-4 mb-4'>
              <button 
                onClick={playAudio}
                disabled={isPlaying}
                className='flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 shadow-lg'
                style={{ backgroundColor: isPlaying ? `${primaryColor}50` : primaryColor }}
              >
                {isPlaying ? (
                  <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 9v6m4-6v6' />
                  </svg>
                ) : (
                  <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                )}
              </button>
              
              <div className='flex-1'>
                <div className='text-sm font-semibold' style={{ color: tertiaryColor }}>
                  {audioBlob ? `Recorded Audio` : 'Uploaded Audio'}
                </div>
                <div className='text-xs' style={{ color: `${tertiaryColor}70` }}>
                  {audioBlob ? `${formatTime(recordingTime)} • ${(audioBlob.size / 1024).toFixed(1)} KB` : 'Audio file loaded'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex space-x-3'>
              <button 
                onClick={() => {
                  setAudioBlob(null)
                  setAudioUrl('')
                  setRecordingTime(0)
                }}
                className='flex-1 py-3 px-4 text-sm rounded-lg transition-all duration-200 hover:scale-105 border-2'
                style={{ borderColor: `${primaryColor}30`, color: primaryColor, backgroundColor: 'white' }}
              >
                Clear
              </button>
              <button 
                onClick={async () => {
                  if (audioBlob) {
                    try {
                      setIsEvaluating(true)
                      
                      // Evaluate audio using Gemini
                      const geminiService = GeminiService.getInstance()
                      const evaluation = await geminiService.evaluateAudioAnswer(currentQuestion, audioBlob)
                      
                      // Don't set the answer text, just store the evaluation results
                      setAnswer('') // Clear the input box
                      setAudioResult(evaluation)
                      setIsAudioResult(true)
                      setShowRecordingModal(false)
                      handleSubmitAudio()
                    } catch (error) {
                      console.error('Error evaluating audio:', error)
                      alert('Failed to evaluate audio. Please try again.')
                    } finally {
                      setIsEvaluating(false)
                    }
                  }
                }}
                disabled={!audioBlob || isEvaluating}
                className='flex-1 py-3 px-4 text-sm rounded-lg text-white transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                style={{ backgroundColor: audioBlob && !isEvaluating ? primaryColor : `${primaryColor}50` }}
              >
                {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        )}

        {/* Recording Status */}
        {isRecording && (
          <div className='flex items-center justify-center space-x-3 py-3 px-4 rounded-xl' style={{ backgroundColor: `${primaryColor}10` }}>
            <div className='w-3 h-3 rounded-full bg-red-500 animate-pulse'></div>
            <span className='text-sm font-medium' style={{ color: '#ef4444' }}>
              Recording... {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
