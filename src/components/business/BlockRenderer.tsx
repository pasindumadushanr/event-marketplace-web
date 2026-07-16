import { CheckCircle } from 'lucide-react';

export function BlockRenderer({ block }: { block: any }) {
  if (!block) return null;

  if (block.type === 'TEXT') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-l-2xl"></div>
        
        {block.title && (
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{block.title}</h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: block.description || '' }}
          />
          
          {block.imageUrl && (
            <div className="relative h-64 md:h-auto rounded-xl overflow-hidden shadow-sm border border-slate-100">
              <img 
                src={block.imageUrl} 
                alt={block.title || 'Section Image'} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Future expansion blocks can be added here:
  // if (block.type === 'FAQ') return <FaqBlock block={block} />
  // if (block.type === 'ACCORDION') return <AccordionBlock block={block} />

  return null;
}
