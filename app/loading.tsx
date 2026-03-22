export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen relative">
      <span className="absolute top-[50%] left-[50%] translate-[-50%,-50%] text-xs text-gray-800">server loading...</span>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800"></div>
    </div>
  );
}
