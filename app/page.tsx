'use client';

import { useState, useEffect } from 'react';
import { Copy, Trash2, Link2, ExternalLink, TrendingUp,ChartLine } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { Header } from '../components/Header';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

interface Link {
  id: string;
  code: string;
  url: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    linkCode: '',
    linkUrl: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    setLoading(true);
    try {
      const res = await fetch('/api/links');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLinks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setFormError(null);
    setSuccess(null);
    setFormLoading(true);

    try {
      new URL(url);
    } catch {
      setFormError('Invalid URL');
      setFormLoading(false);
      return;
    }

    if (code && !/^[A-Za-z0-9]{6,12}$/.test(code)) {
      setFormError('Invalid custom code (code should contain 6-12 alphanumeric characters)');
      setFormLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code }),
      });

      if (res.status === 409) {
        setFormError('Code already exists');
      } else if (!res.ok) {
        throw new Error('Failed to create');
      } else {
        const newLink = await res.json();
        setSuccess(`Created: ${newLink.code}`);
        toast.success("Link created successfully!");
        setUrl('');
        setCode('');
        fetchLinks();
      }
    } catch (err: any) {
      setFormError(err.message);
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  function openDeleteModal(code: string, url: string) {
    setDeleteModal({
      isOpen: true,
      linkCode: code,
      linkUrl: url,
    });
  }

  function closeDeleteModal() {
    setDeleteModal({
      isOpen: false,
      linkCode: '',
      linkUrl: '',
    });
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/links/${deleteModal.linkCode}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      toast.success("Link deleted successfully!");
      fetchLinks();
      closeDeleteModal();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleCopy(code: string) {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    await navigator.clipboard.writeText(`${base}/${code}`);
    toast.success("Copied to clipboard!");
  }

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(search.toLowerCase()) ||
      link.url.toLowerCase().includes(search.toLowerCase())
  );

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading your links...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 max-w-md">
          <p className="font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Toaster position="top-center" toastOptions={{
        success: { duration: 3000, style: { background: '#3B82F6', color: 'white' } },
        error: { duration: 4000, style: { background: '#EF4444', color: 'white' } }
      }} />

      <Header />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        linkCode={deleteModal.linkCode}
        linkUrl={deleteModal.linkUrl}
        isDeleting={isDeleting}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Links</p>
                <p className="text-3xl font-bold text-blue-600">{links.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Link2 size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
                <p className="text-3xl font-bold text-blue-600">{totalClicks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Clicks</p>
                <p className="text-3xl font-bold text-blue-600">
                  {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ExternalLink size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Link Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Short Link</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Long URL *
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="https://example.com/very-long-url"
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Code (optional)
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="e.g., abc123 (6-12 chars)"
              />
              <p className="text-xs text-gray-500 mt-1">6-12 alphanumeric characters</p>
            </div>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {formError}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={formLoading}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formLoading ? 'Creating...' : 'Create Short Link'}
          </button>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Links</h2>
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          {filteredLinks.length === 0 ? (
            <div className="p-12 text-center">
              <Link2 size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No links found. Create your first short link above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Target URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Last Clicked
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-blue-600">{link.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md truncate text-gray-700" title={link.url}>
                          {link.url}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {link.clicks}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(link.code)}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                            title="Copy link"
                          >
                            <Copy size={16} />
                            Copy
                          </button>

                          <button
                            onClick={() => window.location.href = `/code/${link.code}`}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                            title="View stats"
                          >
                            <ChartLine size={16} />
                            Stats
                          </button>
                          <button
                            onClick={() => openDeleteModal(link.code, link.url)}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                            title="Delete link"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}