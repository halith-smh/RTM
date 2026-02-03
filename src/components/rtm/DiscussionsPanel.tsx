import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Paperclip, Maximize, Minimize } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  user: string;
  initials: string;
  message: string;
  timestamp: string;
}

interface DiscussionsPanelProps {
  requirementId: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const DiscussionsPanel = ({ requirementId, isFullscreen = false, onToggleFullscreen }: DiscussionsPanelProps) => {
  // Empty messages for new requirements
  const [messages, setMessages] = useState<Message[]>(
    requirementId === 'new' ? [] : [
      {
        id: '1',
        user: 'John Smith',
        initials: 'JS',
        message: 'I think we need to clarify the integration requirements with Outlook API.',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        user: 'Sarah Johnson',
        initials: 'SJ',
        message: 'Agreed. Should we also consider the calendar sync frequency?',
        timestamp: '1 hour ago'
      },
      {
        id: '3',
        user: 'Mike Davis',
        initials: 'MD',
        message: 'The current implementation blocks the entire calendar. We might need a more granular approach.',
        timestamp: '30 minutes ago'
      }
    ]
  );

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: 'Current User',
        initials: 'CU',
        message: newMessage,
        timestamp: 'Just now'
      };
      setMessages([message, ...messages]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-background rounded-[14px]",
      isFullscreen ? "fixed inset-0 z-50" : "h-full"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between rounded-[12px]">
        <div>
          <h3 className="font-semibold text-foreground">Discussions</h3>
          {/* <p className="text-sm text-muted-foreground">REQ-{requirementId}</p> */}
        </div>
        {onToggleFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="h-8 w-8"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">No discussions yet</p>
                  <p className="text-xs text-muted-foreground">Start a conversation about this requirement</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {message.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{message.user}</span>
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <p className="text-sm text-foreground break-words">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => toast.info("File attachment feature coming soon")}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button onClick={handleSendMessage} size="icon" className="h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom spacing */}
      {!isFullscreen && <div className="h-1"></div>}
    </div>
  );
};