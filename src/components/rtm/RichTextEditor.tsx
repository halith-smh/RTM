import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Code, Quote, Heading1, Heading2, Maximize2, Minimize2, Eye, Edit3 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  minHeight = "min-h-[150px]",
  readOnly = false
}: RichTextEditorProps) => {
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  const handleFormat = (format: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let insertion = '';

    switch (format) {
      case 'bold':
        insertion = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        insertion = `*${selectedText || 'italic text'}*`;
        break;
      case 'code':
        insertion = `\`${selectedText || 'code'}\``;
        break;
      case 'h1':
        insertion = `\n# ${selectedText || 'Heading 1'}\n`;
        break;
      case 'h2':
        insertion = `\n## ${selectedText || 'Heading 2'}\n`;
        break;
      case 'list':
        insertion = `\n- ${selectedText || 'List item'}`;
        break;
      case 'quote':
        insertion = `\n> ${selectedText || 'Blockquote'}`;
        break;
    }

    if (insertion) {
      const newText = value.substring(0, start) + insertion + value.substring(end);
      onChange(newText);

      // Reset focus and selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + insertion.length, start + insertion.length);
      }, 0);
    }
  };

  const renderContent = () => {
    if (readOnly || isPreview) {
      return (
        <div className={cn(
          "prose prose-sm dark:prose-invert max-w-none p-4 bg-background transition-all duration-200 overflow-auto",
          isFullscreen ? "h-full" : minHeight
        )}>
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value}
            </ReactMarkdown>
          ) : (
            <span className="text-muted-foreground italic">No content provided</span>
          )}
        </div>
      );
    }

    return (
      <Textarea
        ref={editorRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "border-0 focus-visible:ring-0 rounded-none resize-none p-4 font-mono text-sm leading-relaxed",
          isFullscreen ? "flex-grow h-full" : minHeight
        )}
      />
    );
  };

  const containerClasses = cn(
    "border rounded-md shadow-sm bg-background flex flex-col transition-all duration-300",
    isFullscreen ? "fixed inset-0 z-[500] rounded-none h-screen w-screen" : "relative overflow-hidden focus-within:ring-1 focus-within:ring-primary/20"
  );

  return (
    <div className={containerClasses}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-1 border-b bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-1 overflow-x-auto">
          {!readOnly && (
            <>
              <ToggleGroup type="multiple" value={activeFormats} onValueChange={setActiveFormats} disabled={isPreview}>
                <ToggleGroupItem value="bold" aria-label="Toggle bold" size="sm" onClick={() => handleFormat('bold')}>
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic" size="sm" onClick={() => handleFormat('italic')}>
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <div className="w-px h-6 bg-border mx-1" />
                <ToggleGroupItem value="h1" aria-label="Heading 1" size="sm" onClick={() => handleFormat('h1')}>
                  <Heading1 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="h2" aria-label="Heading 2" size="sm" onClick={() => handleFormat('h2')}>
                  <Heading2 className="h-4 w-4" />
                </ToggleGroupItem>
                <div className="w-px h-6 bg-border mx-1" />
                <ToggleGroupItem value="list" aria-label="Bullet list" size="sm" onClick={() => handleFormat('list')}>
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="quote" aria-label="Block quote" size="sm" onClick={() => handleFormat('quote')}>
                  <Quote className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="code" aria-label="Code block" size="sm" onClick={() => handleFormat('code')}>
                  <Code className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 w-8 p-0", isPreview && "bg-accent")}
                onClick={() => setIsPreview(!isPreview)}
                title={isPreview ? "Edit Content" : "Preview Markdown"}
              >
                {isPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className={cn("flex-grow overflow-auto", isFullscreen && "bg-background")}>
        {renderContent()}
      </div>

      {/* Footer / Status */}
      {!readOnly && (
        <div className="px-3 py-1.5 bg-muted/20 border-t text-[10px] text-muted-foreground flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {isPreview ? "Preview Mode" : "Markdown Supported"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>{value?.length || 0} characters</span>
            {isFullscreen && <span className="text-[9px] opacity-70">Press ESC to exit</span>}
          </div>
        </div>
      )}
    </div>
  );
};