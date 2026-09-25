'use client';

import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast animate-fade-in">
        <CheckCircle2 size={20} color="#10B981" />
        <span>{message}</span>
      </div>
    </div>
  );
}
