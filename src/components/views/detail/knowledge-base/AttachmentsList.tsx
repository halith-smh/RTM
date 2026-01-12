import { useState } from 'react';
import { Upload, FileText, Trash2, Download, Maximize2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Attachment } from '@/types/knowledgeBase.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AttachmentsListProps {
  attachments: Attachment[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const AttachmentsList = ({ attachments, onUpload, onDelete }: AttachmentsListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 100);

    try {
      await onUpload(file);
      setUploadProgress(100);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Section */}
      <div className={`flex flex-col border rounded-lg bg-card overflow-hidden ${isExpanded ? 'fixed inset-4 z-[600] bg-white shadow-2xl p-6' : ''}`}>
        <div className="flex items-center justify-between p-4 border-b bg-muted/10">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Existing Attachments</h3>
            <Badge variant="secondary">{attachments.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/5">
                <TableHead className="text-xs font-semibold text-muted-foreground">File Name</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Tags</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Uploaded By</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Uploaded On</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attachments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                    No documents attached yet.
                  </TableCell>
                </TableRow>
              ) : (
                attachments.map((file) => (
                  <TableRow key={file.id} className="hover:bg-muted/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-medium">{file.filename}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">({formatBytes(file.size)})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                          {file.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                        {file.size > 1024 * 1024 && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal bg-orange-50 text-orange-600 border-orange-100">
                            Large
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                            {file.uploadedBy.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{file.uploadedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(file.uploadDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => toast.success(`Downloading ${file.filename}`)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => onDelete(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Upload Action / Drop Zone Footer */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "p-4 border-t transition-all duration-200",
            isDragging ? "bg-primary/5 border-primary" : "bg-muted/5",
            uploading && "opacity-50 pointer-events-none"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              {uploading ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    <span>Uploading file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1" />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Drag and drop files here or click upload to add new documents.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="file-upload-kb"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-8 bg-white"
                disabled={uploading}
              >
                <label htmlFor="file-upload-kb" className="cursor-pointer">
                  <Upload className="h-3 w-3 mr-2 text-primary" />
                  Upload
                </label>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
