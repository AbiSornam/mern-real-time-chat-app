import React from 'react'
import { useThemeStore } from '../store/useThemeStore';
import { PaletteIcon } from 'lucide-react';
import { THEMES } from '../constants';

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className='dropdown dropdown-end'>
      {/* dropdown trigger */}
      <button tabIndex={0} className='btn btn-ghost btn-circle'>
        <PaletteIcon className='w-5 h-5' />
      </button>

      {/* dropdown content */}
      <ul
        tabIndex={0}
        className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 max-h-64 overflow-auto'
      >
        {THEMES.map((themeOption) => (
          <li key={themeOption.name}>
            <button
              type='button'
              onClick={() => setTheme(themeOption.name)}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                theme === themeOption.name ? 'bg-primary/10 text-primary' : 'hover:bg-base-content/5'
              }`}
            >
              <PaletteIcon className='w-4 h-4' />
              <span className='text-sm font-medium'>{themeOption.label}</span>

              {/* THEME PREVIEW COLORS */}
              <div className='ml-auto flex gap-2'>
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ThemeSelector