import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const fieldStyle = (
  theme: ReturnType<typeof useAppContext>['theme']
): React.CSSProperties => ({
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: `1px solid ${theme.border}`,
  backgroundColor: theme.background,
  color: theme.text,
  fontSize: '16px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
});

const Feedback: React.FC = () => {
  const { theme } = useAppContext();

  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!feedback.trim()) {
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('https://formspree.io/f/mbgrkovj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          email: email.trim(),
          subject: 'Daily Spend app feedback',
        }),
      });

      if (!response.ok) {
        throw new Error('Feedback submission failed');
      }

      setFeedback('');
      setEmail('');
      setSuccess(true);
      setMessage('Thank you! Your feedback has been submitted.');
    } catch (error) {
      console.error('Feedback submission failed:', error);
      setSuccess(false);
      setMessage('Unable to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '8px',
        }}
      >
        Feedback
      </h1>

      <p
        style={{
          color: theme.textSecondary,
          fontSize: '14px',
          marginBottom: '20px',
        }}
      >
        We'd love to hear how you're using Daily Spend and how we can improve it.
      </p>

      <div
        style={{
          backgroundColor: theme.surface,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${theme.border}`,
          marginBottom: '16px',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div>
            <label
              htmlFor="feedback"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Your feedback
            </label>

            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                setMessage(null);
              }}
              placeholder="Tell us what you think, report a bug, or suggest a feature…"
              required
              rows={5}
              style={{
                ...fieldStyle(theme),
                minHeight: '110px',
                resize: 'vertical',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Email (optional)
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage(null);
              }}
              placeholder="you@example.com"
              style={fieldStyle(theme)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              minHeight: '48px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: theme.primary,
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
              cursor: submitting ? 'wait' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Sending…' : '✉️ Send feedback'}
          </button>
        </form>

        {message && (
          <p
            role="status"
            style={{
              color: success ? theme.success : theme.error,
              fontSize: '12px',
              marginTop: '10px',
            }}
          >
            {message}
          </p>
        )}
      </div>

      <p
        style={{
          color: theme.textSecondary,
          fontSize: '12px',
          textAlign: 'center',
        }}
      >
        Your feedback is securely submitted through our feedback service.
      </p>
    </div>
  );
};

export default Feedback;