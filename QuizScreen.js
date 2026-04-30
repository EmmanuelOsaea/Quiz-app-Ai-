import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { generateQuizQuestion } from './openai';
import {
  saveInProgressAttempt,
  loadInProgressAttempt,
  clearInProgressAttempt,
  saveFinishedAttempt,
} from './progressStore';
import { playCorrect, playWrong, playFinish } from './sound';

const { width } = Dimensions.get('window');

function AnimatedQuestion({ children }) {
  const y = useRef(new Animated.Value(10)).current;
  const o = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    y.setValue(10);
    o.setValue(0);
    Animated.parallel([
      Animated.timing(y, { toValue: 0, duration: 260, useNativeDriver: true }),
      Animated.timing(o, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [children, y, o]);

  return (
    <Animated.View style={{ transform: [{ translateY: y }], opacity: o }}>
      <Text style={styles.questionText}>{children}</Text>
    </Animated.View>
  );
}

export default function QuizScreen({ route, navigation }) {
  const { topic, resumeData } = route.params || {};
  const totalQuestions = 5;

  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(15);
  const timerRef = useRef(null);

  const [progressValue, setProgressValue] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  // Load resume data on mount
  useEffect(() => {
    if (resumeData) {
      setQuestionCount(resumeData.questionCount);
      setScore(resumeData.score);
      setAnswers(resumeData.answers);
      setProgressValue(resumeData.questionCount / totalQuestions);
      progress.setValue(resumeData.questionCount / totalQuestions);
      setQuestionData(resumeData.currentQuestion);
      setLoading(false);
    } else {
      fetchQuestion();
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (!loading && !showExplanation && questionData) {
      setTimer(15);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [questionData, showExplanation, loading]);

  // Fetch new question
  async function fetchQuestion() {
    setLoading(true);
    try {
      const data = await generateQuizQuestion(topic);
      if (data) {
        setQuestionData(data);
        setSelectedOption(null);
        setShowExplanation(false);
        setLoading(false);

        const newProgress = (questionCount + 1) / totalQuestions;
        setProgressValue(newProgress);
        Animated.timing(progress, {
          toValue: newProgress,
          duration: 500,
          useNativeDriver: false,
        }).start();

        // Save progress with current question
        await saveInProgressAttempt({
          topic,
          questionCount,
          score,
          totalQuestions,
          answers,
          currentQuestion: data,
          updatedAt: new Date(),
        });
      } else {
        throw new Error('No question data');
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'Failed to load question. Please try again.');
    }
  }

  // Submit answer handler
  async function handleSubmit(auto = false) {
    clearInterval(timerRef.current);
    if (!auto && selectedOption === null) return;

    const correct = selectedOption === questionData.correctAnswerIndex;
    if (correct) playCorrect();
    else playWrong();

    const newScore = correct ? score + 1 : score;
    setScore(newScore);

    const answerRecord = {
      question: questionData.question,
      options: questionData.options,
      correctAnswerIndex: questionData.correctAnswerIndex,
      selectedOption,
      explanation: questionData.explanation,
    };

    const newAnswers = [...answers, answerRecord];
    setAnswers(newAnswers);
    setShowExplanation(true);

    // Save progress with updated answers and score
    await saveInProgressAttempt({
      topic,
      questionCount: questionCount + 1,
      score: newScore,
      totalQuestions,
      answers: newAnswers,
      updatedAt: new Date(),
    });
  }

  // Next question or finish quiz
  async function handleNext() {
    if (questionCount + 1 >= totalQuestions) {
      playFinish();
      await saveFinishedAttempt({
        topic,
        score,
        totalQuestions,
        answers,
      });
      await clearInProgressAttempt();
      navigation.replace('Results', { score, totalQuestions, answers });
    } else {
      setQuestionCount(questionCount + 1);
      setShowExplanation(false);
      setSelectedOption(null);
      fetchQuestion();
    }
  }

  // Progress bar width interpolation
  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.3],
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text>Loading question...</Text>
      </View>
    );
  }

  if (!questionData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Failed to load question. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBarFill, { width: progressBarWidth }]} />
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Time: {timer}s</Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <AnimatedQuestion>{questionData.question}</AnimatedQuestion>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          {[0, 1].map((i) => (
            <Pressable
              key={i}
              onPress={() => !showExplanation && setSelectedOption(i)}
              disabled={showExplanation}
              style={({ pressed }) => [
                styles.optionBox,
                pressed && !showExplanation && { transform: [{ scale: 0.98 }], opacity: 0.9 },
                selectedOption === i && styles.selectedOption,
                showExplanation && i === questionData.correctAnswerIndex && styles.correctOption,
                showExplanation && selectedOption === i && selectedOption !== questionData.correctAnswerIndex && styles.incorrectOption,
              ]}
            >
              <Text style={styles.optionText}>{questionData.options[i]}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.optionsRowCenter}>
          <Pressable
            onPress={() => !showExplanation && setSelectedOption(2)}
            disabled={showExplanation}
            style={({ pressed }) => [
              styles.optionBox,
              pressed && !showExplanation && { transform: [{ scale: 0.98 }], opacity: 0.9 },
              selectedOption === 2 && styles.selectedOption,
              showExplanation && 2 === questionData.correctAnswerIndex && styles.correctOption,
              showExplanation && selectedOption === 2 && selectedOption !== questionData.correctAnswerIndex && styles.incorrectOption,
            ]}
          >
            <Text style={styles.optionText}>{questionData.options[2]}</Text>
          </Pressable>
        </View>
      </View>

      {/* Explanation */}
      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            {selectedOption === questionData.correctAnswerIndex ? 'Correct! ' : 'Incorrect. '}
            {questionData.explanation}
          </Text>
        </View>
      )}

      {/* Submit / Next Button */}
      {!showExplanation ? (
        <Pressable
          style={[styles.submitButton, selectedOption === null && styles.disabledButton]}
          disabled={selectedOption === null}
          onPress={() => handleSubmit(false)}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next Question</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  progressBarContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    height: 8,
    width: width * 0.3,
    backgroundColor:  '#A52A2A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: '#3C75E0' },
  timerContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D8BFD8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  timerText: { color: '#4B0082', fontWeight: 'bold' },
  questionContainer: { marginTop: 60, alignItems: 'center', marginBottom: 40 },
  questionText: { fontSize: 22, fontWeight: '600', textAlign: 'center' },
  optionsContainer: { flex: 1 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  optionsRowCenter: { flexDirection: 'row', justifyContent: 'center' },
  optionBox: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: '40%',
    alignItems: 'center',
  },
  selectedOption: { backgroundColor: '#90ee90' },
  correctOption: { backgroundColor: '#8a9aaf' },
  incorrectOption: { backgroundColor: '#D8BFD8' },
  optionText: { fontSize: 18 },
  explanationContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#ADD8E6',
    padding: 15,
    borderRadius: 10,
  },
  explanationText: { fontSize: 16, color: '#00008B' },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#a0a0a0' },
  submitButtonText: { color: '#fff', fontSize: 18 },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 18 },
});
