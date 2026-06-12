export default function LoadingBar() {
  return (
    <div className="w-full h-1 bg-surface-700 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse-slow"
        style={{
          animation: 'loading 1.5s ease-in-out infinite',
          width: '40%',
        }}
      />
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
