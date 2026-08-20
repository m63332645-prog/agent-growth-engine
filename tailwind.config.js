/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{ts,tsx,js,jsx}',
    '!./node_modules/**',
  ],
  theme: {
    extend: {
      colors: {
        manulife: {
          primary: '#00A758',
          status: '#F49600',
          alert: '#EC6453',
          title: '#34384B',
          body: '#282B3E',
          secondary: '#8E90A2',
          disabled: '#C0C4CC',
          hint: '#E4E7ED',
          cardBg: '#F2F6FC',
          pageBg: '#F4F6F8',
          border: '#EDEDED',
          white: '#FFFFFF',
          greenLight: '#00C46E',
          greenMint: '#5CD790',
          greenPale: '#ACE5C4',
          greenSoft: '#CAEED9',
          cream: '#FBE9C6',
        },
        // 全局覆盖 Indigo 为品牌主色系列 (#00A758)
        indigo: {
          50: '#f0f9f4',
          100: '#CAEED9',
          200: '#ACE5C4',
          300: '#5CD790',
          400: '#00C46E',
          500: '#00A758',
          600: '#00A758',
          700: '#008a49',
          800: '#006d3a',
          900: '#00522c',
        },
        // 全局覆盖 Blue 为辅助绿系列
        blue: {
          50: '#f0f9f4',
          100: '#CAEED9',
          200: '#ACE5C4',
          300: '#5CD790',
          400: '#00C46E',
          500: '#00A758',
          600: '#00C46E',
          700: '#00A758',
          800: '#008a49',
          900: '#006d3a',
        },
        // 全局覆盖 Purple 为提示/状态系列 (#F49600)
        purple: {
          50: '#fef9f0',
          100: '#FBE9C6',
          200: '#f9d893',
          300: '#f7c760',
          400: '#f5b62d',
          500: '#F49600',
          600: '#d98500',
          700: '#bf7500',
          800: '#a66600',
          900: '#8c5600',
        },
        amber: {
          500: '#F49600',
        },
        // 全局覆盖 Rose 为提醒色 (#EC6453)
        rose: {
          500: '#EC6453',
        },
        // 全局覆盖 Green 为品牌主色系列 (#00A758)
        green: {
          50: '#f0f9f4',
          100: '#CAEED9',
          200: '#ACE5C4',
          300: '#5CD790',
          400: '#00C46E',
          500: '#00A758',
          600: '#00A758',
          700: '#008a49',
          800: '#006d3a',
          900: '#00522c',
        },
        // 全局覆盖 Slate 为精准的文字和背景体系
        slate: {
          50: '#F4F6F8',
          100: '#EDEDED',
          200: '#E4E7ED',
          300: '#F2F6FC',
          400: '#C0C4CC',
          500: '#8E90A2',
          600: '#5A5E73',
          700: '#45495E',
          800: '#34384B',
          900: '#282B3E',
        },
        brand: {
          green: {
            DEFAULT: '#00A758',
            light: '#f0f9f4',
            muted: '#CAEED9',
            dark: '#006d3a',
          },
        },
        // 星钻四级颜色（星钻荣誉页使用，取自参考项目设计系统色卡）
        diamond: {
          green: '#00A75B',    // 星钻 - 中宏绿
          silver: '#8E90A2',   // 银星钻 - 银色
          gold: '#F9AD21',     // 金星钻 - 金色
          platinum: '#282B3E', // 白金星钻 - 深蓝色
        },
      },
    },
  },
  plugins: [],
};
