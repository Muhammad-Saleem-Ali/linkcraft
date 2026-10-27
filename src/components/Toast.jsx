'use client';
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
export default function Toast({ message }) {
    if (!message)
        return null;
    return (<div className="toast-container">
      <div className="toast animate-fade-in">
        <CheckCircle2 size={20} color="#10B981"/>
        <span>{message}</span>
      </div>
    </div>);
}
