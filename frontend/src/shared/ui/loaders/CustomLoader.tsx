import { Spinner } from "@/shared/ui/spinner";

function CustomLoader() {
  return (
    <div className="flex items-center gap-6">
      <Spinner className="size-16 text-primary"  />
    </div>
  );
}

export default CustomLoader;
