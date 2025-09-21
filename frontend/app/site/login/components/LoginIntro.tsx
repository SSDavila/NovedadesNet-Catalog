'use client';

interface LoginIntroProps {
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
}

export default function LoginIntro({ mode, setMode }: LoginIntroProps) {
  return (
    <div className="p-8 md:p-12 text-white flex flex-col justify-center items-center md:items-start text-center md:text-left">
      <h1 className="text-4xl font-bold mb-4">
        {mode === 'login' ? 'Bienvenido de Nuevo' : 'Crea tu Cuenta'}
      </h1>
      <p className="mb-8 text-blue-100">
        {mode === 'login'
          ? 'Ingresa tus credenciales para acceder a tu cuenta.'
          : 'Regístrate para disfrutar de todos nuestros beneficios.'}
      </p>

      <div className="mt-8 flex items-center gap-4">
        <span className="text-sm text-blue-100">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes una?'}
        </span>
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-800/60 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
          aria-label="Toggle between login and register"
        >
          <span
            aria-hidden="true"
            className={`${mode === 'register' ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </button>
      </div>
    </div>
  );
}
