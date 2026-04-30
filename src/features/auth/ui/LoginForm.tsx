import { useState } from 'react';
import { supabase } from '@shared/api/supabase';
import { Mail } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.href,
      },
    });

    if (error) {
      setMessage({ type: 'error', text: '로그인 링크 전송에 실패했습니다: ' + error.message });
    } else {
      setMessage({ type: 'success', text: '이메일로 로그인 링크를 보냈습니다! 메일함을 확인해주세요.' });
    }
    setIsLoading(false);
  };

  return (
    <div className="ios-glass p-8 max-w-[400px] w-full mx-auto animate-ios-in">
      <div className="flex flex-col items-center space-y-6">
        <div className="bg-blue-600 p-4 rounded-full text-white shadow-lg shadow-blue-900/30">
          <Mail size={32} />
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight mb-1">Twinkle ✨</h2>
          <p className="text-sm font-medium text-gray-500">이메일로 간편하게 시작하세요</p>
        </div>

        <form onSubmit={handleMagicLinkLogin} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-black text-gray-500 uppercase ml-1">이메일 주소</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="example@mail.com"
              className="w-full bg-[#1c1c1e] text-white rounded-2xl p-4 outline-none border border-white/5 focus:border-blue-500/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg active:scale-[0.98] transition-transform flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : '로그인 링크 받기'}
          </button>
        </form>

        {message && (
          <p className={`text-sm font-bold text-center ${
            message.type === 'success' ? 'text-blue-500' : 'text-red-500'
          }`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};
