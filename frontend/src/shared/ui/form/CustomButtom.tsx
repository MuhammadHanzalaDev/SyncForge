import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

interface CustomButtonProps {
  children: React.ReactElement | string;
  disabled?: boolean;
  isLoading?: boolean;
  variant?:
    | "outline"
    | "link"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className?: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
}

export default function CustomButton({
  children,
  disabled,
  isLoading,
  variant = "outline",
  className = "",
  type = "button",
  onClick = () => {},
}: CustomButtonProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={variant}
        disabled={disabled}
        className={className}
        type={type}
        onClick={onClick}
      >
        {children}
        {isLoading && <Spinner data-icon="inline-start" />}
      </Button>
    </div>
  );
}
