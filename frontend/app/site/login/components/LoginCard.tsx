'use client';

import LoginIntro from './LoginIntro';
import LoginForm from './LoginForm';

export default function LoginCard() {
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[500px]">

      <div className="bg-blue-600">
        <LoginIntro />
      </div>

      <div className="p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
        <LoginForm />
      </div>
    </div>
  );
}
