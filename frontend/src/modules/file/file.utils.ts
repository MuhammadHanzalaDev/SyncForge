import {
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  FileAudio,
  FileVideo,
  File as FileIcon,
} from "lucide-react";

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const getFileIcon = (file: File) => {
  const name = file.name.toLowerCase();
  const type = file.type;

  if (type.startsWith("audio/")) return FileAudio;
  if (type.startsWith("video/")) return FileVideo;
  if (
    type.includes("zip") ||
    type.includes("rar") ||
    type.includes("tar") ||
    /\.(zip|rar|7z|tar|gz)$/.test(name)
  )
    return FileArchive;
  if (
    type.includes("sheet") ||
    type.includes("excel") ||
    type.includes("csv") ||
    /\.(xls|xlsx|csv)$/.test(name)
  )
    return FileSpreadsheet;
  if (/\.(js|ts|jsx|tsx|json|html|css|py|rb|go|rs|java|cpp|c|php)$/.test(name))
    return FileCode;
  if (
    type.includes("pdf") ||
    type.includes("word") ||
    type.includes("text") ||
    /\.(pdf|doc|docx|txt|md)$/.test(name)
  )
    return FileText;

  return FileIcon;
};

export { formatFileSize, getFileIcon };
