'use client';

import { useState } from 'react';
import { FaqHero } from '@/components/faq/FaqHero';
import { FaqAccordion } from '@/components/faq/FaqAccordion';
import { FaqHelp } from '@/components/faq/FaqHelp';
import { AboutCTA } from '@/components/about/AboutCTA';
import { faqData } from '@/data/faq';

export function FaqContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');

  // Filter FAQs based on search query
  const filteredCategories = faqData.categories.map(category => {
    return {
      ...category,
      faqs: category.faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  }).filter(category => category.faqs.length > 0);

  // When searching, we want to show all categories that have matches, 
  // otherwise we just show the active category
  const displayCategories = searchQuery 
    ? filteredCategories 
    : faqData.categories.filter(c => c.id === activeCategory);

  return (
    <main className="flex-1">
      <FaqHero 
        data={faqData.hero} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery} 
      />
      
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Sidebar Categories */}
            <div className="w-full md:w-64 shrink-0">
              <div className="sticky top-32 space-y-1">
                {!searchQuery && faqData.categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      activeCategory === category.id 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
                {searchQuery && (
                  <div className="px-4 py-3 text-slate-500 font-medium">
                    Search Results ({filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)})
                  </div>
                )}
              </div>
            </div>

            {/* Main FAQ Accordion */}
            <div className="flex-1">
              {displayCategories.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                  <p className="text-slate-500">We couldn't find any FAQs matching "{searchQuery}"</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-6 text-primary font-medium hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <FaqAccordion categories={displayCategories} showCategoryTitles={!!searchQuery} />
              )}
            </div>

          </div>
        </div>
      </section>

      <FaqHelp />
      <AboutCTA data={faqData.cta} />
    </main>
  );
}
