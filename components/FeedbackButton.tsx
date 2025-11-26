'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if user is logged in and pre-fill their info
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || '');
          setUserEmail(user.email || '');
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      return;
    }

    if (!userName.trim() || !userEmail.trim()) {
      alert('Please provide your name and email so we can respond to you!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          userName: userName.trim(),
          userEmail: userEmail.trim(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFeedback('');
        setUserName('');
        setUserEmail('');
        setTimeout(() => {
          setOpen(false);
          setSubmitted(false);
        }, 2000);
      } else {
        alert('Failed to send feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 group flex items-center gap-3 h-16 px-6 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 shadow-2xl hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] hover:scale-105 transition-all duration-300 z-50 animate-pulse hover:animate-none"
          title="Share your feedback with us!"
        >
          <MessageSquare className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-white font-bold text-base hidden sm:inline-block">
            Feedback
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Share Your Feedback
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
            We value your opinion! Let us know what you think about our
            platform.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your feedback has been sent successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Feedback Field */}
            <div>
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Feedback
              </label>
              <textarea
                id="feedback"
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none transition-all"
                placeholder="Tell us what you think... suggestions, bugs, features you'd like to see, or just say hi! 💬"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={
                  isSubmitting ||
                  !feedback.trim() ||
                  !userName.trim() ||
                  !userEmail.trim()
                }
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
