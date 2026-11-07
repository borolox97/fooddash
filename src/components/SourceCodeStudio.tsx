import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  FileCode,
  FolderTree,
  Search,
} from 'lucide-react';
import {
  ALL_ANDROID_PROJECT_FILES,
  AndroidSourceFile,
  buildAndroidProjectTarBlob,
} from '../data/androidProject';

interface SourceCodeStudioProps {
  selectedFileName?: string;
  onSelectFileName?: (name: string) => void;
}

export const SourceCodeStudio: React.FC<SourceCodeStudioProps> = ({
  selectedFileName,
  onSelectFileName,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const activeFile: AndroidSourceFile =
    ALL_ANDROID_PROJECT_FILES.find(
      (f) => f.name === selectedFileName || f.path === selectedFileName
    ) || ALL_ANDROID_PROJECT_FILES[0];

  const categories = [
    { id: 'ALL', label: `All Files (${ALL_ANDROID_PROJECT_FILES.length})` },
    { id: 'activities', label: 'Activities (14)' },
    { id: 'models', label: 'Models (4)' },
    { id: 'adapters', label: 'Adapters (3)' },
    { id: 'helpers', label: 'Helpers (4)' },
    { id: 'layout', label: 'XML Layouts (17)' },
    { id: 'values', label: 'Values & Drawables' },
    { id: 'config', label: 'Manifest, Gradle & Rules' },
  ];

  const filteredFiles = ALL_ANDROID_PROJECT_FILES.filter((file) => {
    const matchesCat =
      categoryFilter === 'ALL' || file.category === categoryFilter;
    const matchesQuery =
      !searchTerm.trim() ||
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCopyFile = (file: AndroidSourceFile) => {
    navigator.clipboard.writeText(file.content);
    setCopiedPath(file.path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleDownloadSingleFile = (file: AndroidSourceFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullProjectTar = () => {
    const blob = buildAndroidProjectTarBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FoodDash-AndroidStudio-Java-XML.tar';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            Complete Android Studio Source Code (100% Java + XML)
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Package <code className="font-mono text-[#EA580C]">com.fooddash.app</code> · 25 Java files (14 Activities, 4 Models, 3 Adapters, 4 Helpers), 17 XML layouts, Manifest, Gradle, and Firebase Rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadFullProjectTar}
          className="px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-xs transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>Download Complete Project (.tar)</span>
        </button>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              categoryFilter === cat.id
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Split Explorer & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left File Tree (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              aria-label="Filter project files"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Java or XML file..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-xs"
            />
          </div>

          <div className="max-h-[560px] overflow-y-auto space-y-1 pr-1">
            {filteredFiles.map((file) => {
              const isSelected = file.path === activeFile.path;
              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => onSelectFileName?.(file.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#F97316] text-white font-semibold'
                      : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected ? 'text-white' : 'text-[#EA580C]'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono">{file.name}</div>
                    <div
                      className={`text-[11px] truncate ${
                        isSelected ? 'text-orange-100' : 'text-stone-500'
                      }`}
                    >
                      {file.path}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-stone-950 text-stone-100 rounded-2xl border border-stone-800 overflow-hidden">
          <div className="px-5 py-3.5 bg-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-white">
                <FolderTree className="w-4 h-4 text-[#F97316] shrink-0" />
                <span className="truncate">{activeFile.path}</span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {activeFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopyFile(activeFile)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                {copiedPath === activeFile.path ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDownloadSingleFile(activeFile)}
                className="px-3 py-1.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {activeFile.name}</span>
              </button>
            </div>
          </div>

          <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto text-stone-200">
            <code>{activeFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
