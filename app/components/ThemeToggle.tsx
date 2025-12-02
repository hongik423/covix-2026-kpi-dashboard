'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 마운트 상태 업데이트
    if (typeof window !== 'undefined') {
      // 다음 프레임에서 상태 업데이트 (cascading render 방지)
      requestAnimationFrame(() => {
        setMounted(true);
      });
    }
  }, []);

  if (!mounted) {
    // 서버 사이드 렌더링 시 빈 버튼 반환 (레이아웃 깨짐 방지)
    return (
      <button
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors"
        aria-label="테마 전환"
        disabled
      >
        <Moon className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="테마 전환"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}

