import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { X } from "lucide-react";

export default function InviteEmails() {
  const [emails, setEmails] = useState<string[]>([]);
  const [value, setValue] = useState("");

  const addEmail = () => {
    if (!value.trim()) return;

    setEmails([...emails, value.trim()]);
    setValue("");
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border rounded-md p-2">
        {emails.map((email) => (
          <Badge key={email} className="flex items-center gap-1">
            {email}
            <X
              size={14}
              className="cursor-pointer"
              onClick={() => removeEmail(email)}
            />
          </Badge>
        ))}

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter email and press Enter"
          className="border-none shadow-none"
        />
      </div>

    </div>
  );
}
