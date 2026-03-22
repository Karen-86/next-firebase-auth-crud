export const LoadingScreen = ({ value = "client loading..." }) => {
  return (
    <div className="relative flex h-screen items-center justify-center">
      <span className="text-xs text-blue-500">{value}</span>
      <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
    </div>
  )
}
