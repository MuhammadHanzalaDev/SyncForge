import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

interface CustomButtonProps {
  children: React.ReactNode | string;
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
  size?: "default" | "xs" | "sm" | "lg" | "icon";
  onClick?: () => void;
}

export default function CustomButton({
  children,
  disabled,
  isLoading,
  variant = "default",
  className = "",
  type = "button",
  size = "default",
  onClick = () => {},
}: CustomButtonProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={variant}
        disabled={disabled}
        className={"w-full md:w-auto" + className}
        type={type}
        size={size}
        onClick={onClick}
      >
        {children}
        {isLoading && <Spinner data-icon="inline-start" />}
      </Button>
    </div>
  );
}
