'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginIntro from './LoginIntro';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function LoginCard() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[500px]">

      <div className="bg-blue-600">
        <LoginIntro mode={mode} setMode={setMode} />
      </div>

      <div className="p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            {mode === 'login' ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
