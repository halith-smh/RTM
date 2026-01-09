import { cn } from '@/lib/utils';

interface Section {
    id: string;
    label: string;
}

interface KnowledgeBaseNavProps {
    sections: Section[];
    activeSection: string;
    onSectionClick: (id: string) => void;
}

export const KnowledgeBaseNav = ({ sections, activeSection, onSectionClick }: KnowledgeBaseNavProps) => {
    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-1 pointer-events-none">
            <div className="relative flex flex-col items-center py-4 pointer-events-auto pr-8">
                {/* Vertical Line Line */}
                <div className="absolute right-[19px] top-6 bottom-6 w-0.5 bg-slate-200 rounded-full" />

                {/* Markers */}
                {sections.map((section, index) => {
                    const isActive = section.id === activeSection;
                    return (
                        <div 
                            key={section.id} 
                            className="relative flex items-center justify-end w-full group h-12"
                        >
                            {/* Label Tooltip */}
                            <div 
                                className={cn(
                                    "mr-8 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 transform origin-right shadow-sm border opacity-0 translate-x-4",
                                    isActive 
                                        ? "bg-primary text-primary-foreground opacity-100 translate-x-0 scale-100" 
                                        : "bg-white text-slate-600 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100"
                                )}
                            >
                                {section.label}
                            </div>

                            {/* Dot Marker */}
                            <button
                                onClick={() => onSectionClick(section.id)}
                                className={cn(
                                    "absolute right-3.5 w-2.5 h-2.5 rounded-full transition-all duration-300 z-10 border-2",
                                    isActive 
                                        ? "bg-primary border-primary w-3.5 h-3.5 right-3" 
                                        : "bg-slate-300 border-white group-hover:bg-primary/50"
                                )}
                                aria-label={`Scroll to ${section.label}`}
                            />
                        </div>
                    );
                })}

                {/* Active Indicator Follower (Optional - simplifies for now with just active state above) */}
            </div>
        </div>
    );
};
