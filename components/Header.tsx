import {  Link2 } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Link2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">TinyLink</h1>
              <p className="text-blue-100 text-sm">Shorten, Share, Track</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{0}</div>
              <div className="text-blue-200">Total Links</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{0}</div>
              <div className="text-blue-200">Total Clicks</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
