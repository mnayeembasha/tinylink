export  function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 text-center">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 max-w-md w-full border border-blue-100">
        
        <h1 className="text-3xl font-extrabold text-blue-700 mb-3 tracking-tight">
          TinyLink Not Found
        </h1>

        <p className="text-blue-800/70 mb-6 leading-relaxed">
          The TinyLink URL you are trying to access cannot be found.
          It may have been deleted by the creator, expired, or never existed.
        </p>

        <p className="text-sm text-blue-900/60 mb-8">
          Double-check the short code or return to the dashboard to manage your links.
        </p>

        <a
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold transition shadow-md hover:shadow-lg"
        >
          Go Back Home
        </a>
      </div>

      <p className="mt-8 text-xs text-blue-700/60 tracking-wide">
        TinyLink • Shorten, Share, Track.
      </p>
    </div>
  );
}
