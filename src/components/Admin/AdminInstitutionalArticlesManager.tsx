import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { InstitutionalArticle } from '../../types';
import { MultiImagePresetPicker, MediaAttachmentsManager } from './ImagePresetPicker';
import { getArticlePermalink } from '../../utils/permalinks';
import {
  BookOpen,
  Edit2,
  ExternalLink,
  Save,
  X,
  CheckCircle2,
  Award,
  Users,
  Building2,
  Trophy,
  Palette,
  School,
  FileText,
  Sparkles,
  Search,
  Eye,
  Link,
  Plus,
  Copy,
  Check,
  Video,
  Music
} from 'lucide-react';

export const AdminInstitutionalArticlesManager: React.FC = () => {
  const { institutionalArticles, updateInstitutionalArticle, openArticleBySlug } = useSchool();
  const [selectedArticle, setSelectedArticle] = useState<InstitutionalArticle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'about' | 'education'>('all');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'about' | 'education'>('about');
  const [articleUrl, setArticleUrl] = useState('');
  const [badge, setBadge] = useState('');
  const [author, setAuthor] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [iconName, setIconName] = useState('BookOpen');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [content, setContent] = useState('');

  const handleSelectArticle = (art: InstitutionalArticle) => {
    setSelectedArticle(art);
    setTitle(art.title);
    setSubtitle(art.subtitle || '');
    setCategory(art.category);
    setArticleUrl(art.articleUrl || '');
    setBadge(art.badge || '');
    setAuthor(art.author || '');
    setUpdatedAt(art.updatedAt || '');
    setCoverImage(art.coverImage || '');
    const currentImgs = Array.isArray(art.images) && art.images.length > 0
      ? art.images
      : [art.coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop'];
    setImages(currentImgs);
    setVideoUrl(art.videoUrl || '');
    setAudioUrl(art.audioUrl || '');
    setIconName(art.iconName || 'BookOpen');
    setHighlightsInput((art.highlights || []).join('\n'));
    setContent(art.content);
    setIsEditing(false);
  };

  const handleStartEdit = (art: InstitutionalArticle) => {
    handleSelectArticle(art);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    const highlights = highlightsInput
      .split('\n')
      .map(h => h.trim())
      .filter(Boolean);

    const filteredImages = images.filter(Boolean);
    const primaryCover = filteredImages[0] || coverImage.trim() || undefined;

    const updates: Partial<InstitutionalArticle> = {
      title,
      subtitle,
      category,
      articleUrl: articleUrl.trim() || undefined,
      badge: badge.trim() || undefined,
      author: author.trim() || undefined,
      updatedAt: updatedAt.trim() || new Date().toISOString().split('T')[0],
      coverImage: primaryCover,
      images: filteredImages.length > 0 ? filteredImages : (primaryCover ? [primaryCover] : undefined),
      videoUrl: videoUrl.trim() || undefined,
      audioUrl: audioUrl.trim() || undefined,
      iconName,
      highlights,
      content
    };

    updateInstitutionalArticle(selectedArticle.id, updates);
    setSelectedArticle({ ...selectedArticle, ...updates });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const filteredArticles = institutionalArticles.filter(art => {
    const matchesCat = filterCategory === 'all' || art.category === filterCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.subtitle && art.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Award': return <Award className="w-4 h-4 text-amber-500" />;
      case 'Users': return <Users className="w-4 h-4 text-blue-500" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-indigo-500" />;
      case 'Trophy': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'Palette': return <Palette className="w-4 h-4 text-purple-500" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'School': return <School className="w-4 h-4 text-emerald-500" />;
      case 'FileText': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-500" />;
      default: return <BookOpen className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>Дэд цэсийн нийтлэл & холбоос удирдах</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            "Бидний тухай" (5 цэс) ба "Сургалт" (4 цэс)-ийн дэд урсдаг цэсүүдийн нийтлэл, холбоосууд, зураг, агуулгыг тохируулах.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Бүгд ({institutionalArticles.length})
          </button>
          <button
            onClick={() => setFilterCategory('about')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'about'
                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Бидний тухай (5)
          </button>
          <button
            onClick={() => setFilterCategory('education')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'education'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Сургалт (4)
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Нийтлэлийн мэдээлэл болон холбоос амжилттай хадгалагдлаа!</span>
        </div>
      )}

      {/* Main Grid: Left article list, Right detail/edit panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of articles */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Гарчиг, түлхүүр үгээр хайх..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* List items */}
          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredArticles.map(art => {
              const isSelected = selectedArticle?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => handleSelectArticle(art)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    art.category === 'about' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {getIcon(art.iconName)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        art.category === 'about' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {art.category === 'about' ? 'Бидний тухай' : 'Сургалт'}
                      </span>
                      {art.badge && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                          {art.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {art.title}
                    </h4>

                    {art.subtitle && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {art.subtitle}
                      </p>
                    )}

                    {art.articleUrl && (
                      <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium mt-1 truncate">
                        <Link className="w-3 h-3 shrink-0" />
                        <span className="truncate">{art.articleUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Editor / Detail */}
        <div className="lg:col-span-7">
          {selectedArticle ? (
            isEditing ? (
              /* Edit Form */
              <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-amber-600" />
                    <span>Нийтлэл засварлах: {selectedArticle.title}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Цэс ба Нийтлэлийн гарчиг *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full bg-slate-50 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Товч тайлбар (Дэд гарчиг)
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={e => setSubtitle(e.target.value)}
                      className="w-full bg-slate-50 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  {/* Article External Link */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5 text-blue-600" />
                      <span>Холбоотой нийтлэлийн холбоос URL (Шууд үсрэх)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://eds.edu.mn/#article/greeting"
                      value={articleUrl}
                      onChange={e => setArticleUrl(e.target.value)}
                      className="w-full bg-slate-50 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:bg-white text-blue-600"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Харьяалагдах цэс
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as 'about' | 'education')}
                      className="w-full bg-slate-50 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500"
                    >
                      <option value="about">Бидний тухай</option>
                      <option value="education">Сургалт</option>
                    </select>
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Дүрс icon
                    </label>
                    <select
                      value={iconName}
                      onChange={e => setIconName(e.target.value)}
                      className="w-full bg-slate-50 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500"
                    >
                      <option value="Award">Award (Мэндчилгээ)</option>
                      <option value="Users">Users (Хамт олон)</option>
                      <option value="Building2">Building2 (Түүх)</option>
                      <option value="Trophy">Trophy (Амжилт)</option>
                      <option value="Palette">Palette (Лого, бэлэгдэл)</option>
                      <option value="BookOpen">BookOpen (Сургалтын хөтөлбөр)</option>
                      <option value="School">School (Орчин)</option>
                      <option value="FileText">FileText (Дүрэм журам)</option>
                      <option value="Sparkles">Sparkles (Секц, дугуйлан)</option>
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Нийтлэгч / Алба хэлтэс
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={e => setAuthor(e.target.value)}
                      className="w-full bg-slate-50 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Огноо
                    </label>
                    <input
                      type="text"
                      value={updatedAt}
                      onChange={e => setUpdatedAt(e.target.value)}
                      className="w-full bg-slate-50 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  {/* Images up to 5 */}
                  <div className="sm:col-span-2">
                    <MultiImagePresetPicker
                      images={images}
                      onChange={(newImgs) => {
                        setImages(newImgs);
                        setCoverImage(newImgs[0] || '');
                      }}
                      maxImages={5}
                    />
                  </div>

                  {/* Media Attachments: MP4 Video & MP3 Audio */}
                  <div className="sm:col-span-2">
                    <MediaAttachmentsManager
                      videoUrl={videoUrl}
                      audioUrl={audioUrl}
                      onVideoChange={setVideoUrl}
                      onAudioChange={setAudioUrl}
                    />
                  </div>

                  {/* Highlights */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Онцлох мэдээллийн жагсаалт (Мөр бүрт 1 онцлох зүйл)
                    </label>
                    <textarea
                      rows={3}
                      value={highlightsInput}
                      onChange={e => setHighlightsInput(e.target.value)}
                      placeholder="Жишээ:&#10;Олон улсын хөтөлбөр&#10;Мэргэшсэн багш нар"
                      className="w-full bg-slate-50 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Нийтлэлийн үндсэн агуулга *
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      className="w-full bg-slate-50 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Болих
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Өөрчлөлтийг хадгалах</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Preview / Detail View */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Cover header */}
                <div className="relative h-48 w-full bg-slate-800">
                  <img
                    src={selectedArticle.coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop'}
                    alt={selectedArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-4 right-4 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[85%]">
                    <button
                      onClick={() => {
                        const link = getArticlePermalink(selectedArticle.slug || selectedArticle.id);
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(link);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }
                      }}
                      className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                      title="Шууд холбоос хуулах"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copiedLink ? 'Хуулагдлаа!' : 'Холбоос хуулах'}</span>
                    </button>
                    <button
                      onClick={() => openArticleBySlug(selectedArticle.slug)}
                      className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                      title="Хэрэглэгчийн модал харах"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Модалаар харах</span>
                    </button>
                    <button
                      onClick={() => handleStartEdit(selectedArticle)}
                      className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Засах</span>
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 mb-1.5">
                      {selectedArticle.category === 'about' ? 'Бидний тухай' : 'Сургалт'}
                    </span>
                    <h3 className="text-xl font-extrabold">{selectedArticle.title}</h3>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 space-y-5">
                  {selectedArticle.subtitle && (
                    <p className="text-sm font-medium text-slate-700 italic border-l-3 border-amber-500 pl-3 py-0.5">
                      {selectedArticle.subtitle}
                    </p>
                  )}

                  {/* External Article URL Bar */}
                  {selectedArticle.articleUrl ? (
                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Link className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-blue-950">Нийтлэлийн холбоос:</div>
                          <div className="text-xs text-blue-700 truncate">{selectedArticle.articleUrl}</div>
                        </div>
                      </div>
                      <a
                        href={selectedArticle.articleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1 shrink-0"
                      >
                        <span>Нээх</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                      <span>Энэ нийтлэлд гадаад шууд холбоос тохируулаагүй байна.</span>
                      <button
                        onClick={() => handleStartEdit(selectedArticle)}
                        className="text-amber-700 font-bold hover:underline"
                      >
                        + Холбоос нэмэх
                      </button>
                    </div>
                  )}

                  {/* Highlights */}
                  {selectedArticle.highlights && selectedArticle.highlights.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-700 uppercase">Онцлох мэдээлэл:</div>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {selectedArticle.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Агуулга:</div>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-64 overflow-y-auto">
                      {selectedArticle.content}
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 flex flex-col items-center justify-center">
              <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-semibold text-sm">Зүүн талаас засах нийтлэлээ сонгоно уу.</p>
              <p className="text-xs text-slate-400 mt-1">"Бидний тухай" болон "Сургалт" цэсийн бүх дэд нийтлэлүүдийг эндээс удирдаж болно.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
