export default function LoadingIndicator() {
  return (
    <div className="flex space-x-2">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  );
}
