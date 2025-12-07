'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HelpCircle, Plus, Edit2, Trash2, Save, X, Search, ChevronRight, Server, BookOpen, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

type HelpArticle = {
   id: string;
   title: string;
   category: string;
   content: string;
};

async function fetchHelp() {
   // Reusing the docs API as the backend for knowledge base
   const res = await fetch('/api/support/docs');
   if (!res.ok) throw new Error('Failed to fetch help articles');
   return res.json();
}

export default function HelpCenterPage() {
   const queryClient = useQueryClient();
   const { data, isLoading } = useQuery({ queryKey: ['help-center'], queryFn: fetchHelp });

   const [isEditing, setIsEditing] = useState(false);
   const [currentArticle, setCurrentArticle] = useState<Partial<HelpArticle>>({});
   const [searchTerm, setSearchTerm] = useState('');
   const [openFaqId, setOpenFaqId] = useState<string | null>(null);

   const createMutation = useMutation({
      mutationFn: async (newArticle: Partial<HelpArticle>) => {
         await fetch('/api/support/docs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newArticle)
         });
      },
      onSuccess: () => {
         setIsEditing(false);
         setCurrentArticle({});
         queryClient.invalidateQueries({ queryKey: ['help-center'] });
      }
   });

   const updateMutation = useMutation({
      mutationFn: async (article: Partial<HelpArticle>) => {
         await fetch('/api/support/docs', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article)
         });
      },
      onSuccess: () => {
         setIsEditing(false);
         setCurrentArticle({});
         queryClient.invalidateQueries({ queryKey: ['help-center'] });
      }
   });

   const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
         if (confirm('Are you sure you want to delete this item?')) {
            await fetch(`/api/support/docs?id=${id}`, { method: 'DELETE' });
         }
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['help-center'] })
   });

   const handleSubmit = () => {
      if (!currentArticle.title || !currentArticle.content) return alert('Question/Title and Answer/Content are required');

      const payload = { ...currentArticle };
      // If user didn't specify category logic, we default to General, but the UI handles 'FAQ' selection now.
      if (!payload.category) payload.category = 'General';

      if (currentArticle.id) {
         updateMutation.mutate(payload);
      } else {
         createMutation.mutate(payload);
      }
   };

   if (isLoading) return <div className="p-8">Loading help center...</div>;

   const allArticles = data?.data || [];

   // Filter and Separate
   const filteredItems = allArticles.filter((a: HelpArticle) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const questions = filteredItems.filter((a: HelpArticle) => a.category === 'FAQ');
   const articles = filteredItems.filter((a: HelpArticle) => a.category !== 'FAQ');

   return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <HelpCircle className="mr-3 text-indigo-600" /> Help Center
               </h1>
               <p className="text-gray-500 mt-1">Frequently asked questions and support resources</p>
            </div>
            <div className="flex space-x-3">
               <button
                  onClick={() => { setCurrentArticle({ category: 'FAQ' }); setIsEditing(true); }}
                  className="bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 px-4 py-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center shadow-sm font-medium transition-transform active:scale-95"
               >
                  <MessageCircle size={18} className="mr-2" /> Add Question
               </button>
               <button
                  onClick={() => { setCurrentArticle({ category: 'General' }); setIsEditing(true); }}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 flex items-center shadow-md font-medium transition-transform active:scale-95"
               >
                  <Plus size={18} className="mr-2" /> Add Article
               </button>
            </div>
         </div>

         {/* Search Bar */}
         <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
               type="text"
               placeholder="Search for answers..."
               className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 transition-all font-medium"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         {/* Editor Modal */}
         {isEditing && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 scale-100">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                     <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        {currentArticle.category === 'FAQ' ? <MessageCircle className="mr-2 text-indigo-500" /> : <BookOpen className="mr-2 text-indigo-500" />}
                        {currentArticle.id ? 'Edit Item' : (currentArticle.category === 'FAQ' ? 'New Question' : 'New Article')}
                     </h2>
                     <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                     </button>
                  </div>
                  <div className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                           {currentArticle.category === 'FAQ' ? 'Question' : 'Title'}
                        </label>
                        <input
                           className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                           placeholder={currentArticle.category === 'FAQ' ? "e.g., How do I reset my password?" : "Article Title"}
                           value={currentArticle.title || ''}
                           onChange={e => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Type</label>
                           <select
                              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={currentArticle.category === 'FAQ' ? 'FAQ' : 'Article'}
                              onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value === 'FAQ' ? 'FAQ' : 'General' })}
                           >
                              <option value="FAQ">Q&A (FAQ)</option>
                              <option value="Article">Article / Guide</option>
                           </select>
                        </div>
                        {currentArticle.category !== 'FAQ' && (
                           <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                              <input
                                 className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                                 value={currentArticle.category}
                                 onChange={e => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                              />
                           </div>
                        )}
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                           {currentArticle.category === 'FAQ' ? 'Answer' : 'Content'}
                        </label>
                        <textarea
                           className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-48 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                           placeholder={currentArticle.category === 'FAQ' ? "The answer to the question..." : "Detailed content..."}
                           value={currentArticle.content || ''}
                           onChange={e => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                        />
                     </div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-3">
                     <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                     <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-lg transition-transform active:scale-95 flex items-center">
                        <Save size={18} className="mr-2" /> Save
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* QA Section */}
         {(questions.length > 0 || searchTerm === '') && (
            <div className="space-y-4">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageCircle className="mr-2 text-indigo-500" /> Frequently Asked Questions
               </h2>
               <div className="space-y-3">
                  {questions.length === 0 && (
                     <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">No questions added yet.</div>
                  )}
                  {questions.map((q) => (
                     <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200">
                        <button
                           onClick={() => setOpenFaqId(openFaqId === q.id ? null : q.id)}
                           className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                           <span className="font-semibold text-gray-900 dark:text-white text-lg">{q.title}</span>
                           {openFaqId === q.id ? <ChevronUp className="text-indigo-500" /> : <ChevronDown className="text-gray-400" />}
                        </button>
                        {openFaqId === q.id && (
                           <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
                              <p className="whitespace-pre-wrap">{q.content}</p>
                              <div className="mt-3 flex justify-end space-x-2">
                                 <button onClick={() => { setCurrentArticle(q); setIsEditing(true); }} className="text-sm text-blue-600 hover:underline">Edit</button>
                                 <button onClick={() => deleteMutation.mutate(q.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Articles Grid Section */}
         {(articles.length > 0 || searchTerm === '') && (
            <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <BookOpen className="mr-2 text-indigo-500" /> Detailed Guides & Documentation
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.length === 0 && (
                     <div className="col-span-3 text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300">
                        No detailed articles found.
                     </div>
                  )}
                  {articles.map((article: HelpArticle) => (
                     <div key={article.id} className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1 relative h-full flex flex-col">
                        <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
                           <button
                              onClick={(e) => { e.stopPropagation(); setCurrentArticle(article); setIsEditing(true); }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                           >
                              <Edit2 size={16} />
                           </button>
                           <button
                              onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(article.id); }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                           <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full font-bold uppercase tracking-wide">
                              {article.category}
                           </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">{article.content}</p>
                        <button className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center mt-auto group-hover:underline">
                           Read Guide <ChevronRight size={16} className="ml-1" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         )}

         <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-3 z-50">
            <div className="relative">
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
               </span>
               <Server size={20} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div className="text-xs">
               <p className="font-bold text-gray-900 dark:text-white">API Connected</p>
               <p className="text-gray-500 dark:text-gray-400">Source: /api/support/docs</p>
            </div>
         </div>
      </div>
   );
}
